const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.error("ERROR: Missing password")
  process.exit(1)
}
if (process.argv.length > 3 && process.argv.length < 5) {
  console.error("ERROR: Missing arguments")
  process.exit(1)
}
if (process.argv.length > 5) {
  console.error("ERROR: Too many arguments")
  process.exit(1)
}

const password = process.argv[2]
const MONGO_URL = `mongodb+srv://putkinenriku:${password}@cluster0.iwfm2aa.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(MONGO_URL)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

function getAllNumbers(password) {
  Person.find({}).then(res => {
    console.log('phonebook:')
    res.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    
    mongoose.connection.close()
  })
}

function createNumber(password, name, number) {
  const person = new Person({
    name,
    number
  })
  
  person.save().then(res => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  getAllNumbers(password)
}
if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  createNumber(password, name, number)
}