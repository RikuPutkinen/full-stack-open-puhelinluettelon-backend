require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

const PORT = process.env.PORT || 3001

morgan.token('data', (req) => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(cors())
app.use(morgan('tiny', {
  skip: (req) => req.method === 'POST' || req.method === 'PUT'
}))

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(err => next(err))
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons))
})

app.post('/api/persons',
  express.json(),
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
  (req, res, next) => {
    const { name, number } = req.body

    if (!name) {
      return res.status(400).json({
        error: 'name missing'
      })
    }
    if (!number) {
      return res.status(400).json({
        error: 'number missing'
      })
    }

    const newPerson = new Person({
      name,
      number
    })

    newPerson.save()
      .then(person => {
        res.json(person)
      })
      .catch(err => next(err))
  }
)

app.put('/api/persons/:id',
  express.json(),
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
  (req, res, next) => {
    const { name, number } = req.body
    const id = req.params.id

    if (!name) {
      return res.status(400).json({
        error: 'name missing'
      })
    }
    if (!number) {
      return res.status(400).json({
        error: 'number missing'
      })
    }

    const updatedPerson = {
      name,
      number
    }

    Person.findByIdAndUpdate(
      id,
      updatedPerson,
      { new: true }
    )
      .then(r => res.json(r))
      .catch(err => next(err))
  }
)

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

app.get('/info', (req, res) => {
  const date = new Date()
  Person.find({})
    .then(persons =>
      res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
    )
})

app.use((err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'invalid id' })
  }
  if (err.name === 'ValidationError') {
    console.log(err)
    return res.status(400).send({ error: err.message })
  }

  next(err)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})