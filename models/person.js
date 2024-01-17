const mongoose = require('mongoose')

const mongoURL = process.env.MONGO_URL

console.log(`Connecting to ${mongoURL}`)
mongoose.connect(mongoURL)
  .then(() => console.log('Connected Successfully'))
  .catch(err => console.error('Connection failed:', err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: true
  },
  number: {
    type: String,
    minlength: [8, 'Number must be at least 8 characters long'],
    validate: {
      validator: v => {
        return /(\d{2,3}-\d{5,})|(\d{3}-\d{4,})/.test(v)
      },
      message: 'Invalid phone number. Valid formats are 01-12345 or 012-1234'
    }
  }
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