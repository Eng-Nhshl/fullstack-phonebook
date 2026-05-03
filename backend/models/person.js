const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB')


mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(e => {
    console.log('error connecting to MongoDB:', e.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v) && v.length >= 8
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    default: ''
  },
  category: {
    type: String,
    enum: ['Family', 'Work', 'Friends', 'Emergency', 'Other'],
    default: 'Other'
  },
  notes: {
    type: String,
    maxLength: 500,
    default: ''
  },
  secondaryNumber: {
    type: String,
    default: '',
    validate: {
      validator: function (v) {
        return !v || (/^\d{2,3}-\d+$/.test(v) && v.length >= 8)
      },
      message: props => `${props.value} is not a valid secondary phone number!`
    }
  },
  address: {
    type: String,
    maxLength: 200,
    default: ''
  },
  company: {
    type: String,
    maxLength: 100,
    default: ''
  },
  jobTitle: {
    type: String,
    maxLength: 100,
    default: ''
  },
  birthday: {
    type: Date,
    default: null
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= 10 && v.every(tag => tag.length <= 30)
      },
      message: 'Maximum 10 tags, each tag max 30 characters'
    }
  },
  favorite: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)