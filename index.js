const express = require('express')
const app = express()

const PORT = 3001

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) res.json(person)
  else res.status(404).end()
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons',
  express.json(),
  (req, res) => {
    const id = Math.ceil(Math.random() * 1e9)
    const { name, number } = req.body

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