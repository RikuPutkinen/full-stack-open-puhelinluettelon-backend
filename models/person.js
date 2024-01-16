const mongoose = require('mongoose')

const mongoURL = process.env.MONGO_URL

console.log(`Connecting to ${mongoURL}`)
mongoose.connect(mongoURL)
  .then(res => console.log('Connected Successfully'))
  .catch(err => console.error('Connection failed:', err.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v

    return ret
  }
})

module.exports = mongoose.model('Person', personSchema)