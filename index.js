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

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => res.json(person))
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons))
})

app.post('/api/persons',
  express.json(),
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
  (req, res) => {
    const id = Math.ceil(Math.random() * 1e9)
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
    if (persons.find(p => p.name === name)) {
      return res.status(400).json({
        error: 'name must be unique'
      })
    }

    const newPerson = {
      id,
      name,
      number
    }

    persons.push(newPerson)
    res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})