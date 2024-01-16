require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

const PORT = process.env.PORT || 3001

morgan.token('data', (req, res) => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(cors())
app.use(morgan('tiny', {
  skip: (req, res) => req.method === "POST"
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
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(r => res.status(204).end())
    .catch(err => next(err))
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.use((err, req, res, next) => {
  console.log(err.message)

  if (err.name === "CastError") {
    return res.status(400).send({ error: 'invalid id' })
  }

  next(err)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})