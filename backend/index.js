require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const morgan = require('morgan')
const authRoutes = require('./routes/auth')
const auth = require('./middleware/auth')
const app = express()


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// Authentication routes
app.use('/api/auth', authRoutes)

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}


// info page
app.get('/info', (req, res) => {
  Person.find({}).then(people => {
    const count = people.length
    const date = new Date()
    res.send(`
      <div>
        <h1>Phonebook has info for ${count} people</h1>
        <p>${date}</p>
      </div>
    `)
  })
})


// get all persons for authenticated user
app.get('/api/persons', auth, (req, res, next) => {
  Person.find({ user: req.user._id })
    .populate('user', 'username firstName lastName')
    .then(persons => res.json(persons))
    .catch(e => next(e))
})

// get a single person for authenticated user
app.get('/api/persons/:id', auth, (req, res, next) => {
  Person.findOne({ _id: req.params.id, user: req.user._id })
    .populate('user', 'username firstName lastName')
    .then(person => {
      person ?
        res.json(person)
        :
        res.status(404).json({ error: 'Person not found' })
    })
    .catch(e => next(e))
})

// create a person for authenticated user
app.post('/api/persons', auth, (req, res, next) => {
  const {
    name,
    number,
    email,
    category,
    notes,
    secondaryNumber,
    address,
    company,
    jobTitle,
    birthday,
    tags,
    favorite
  } = req.body

  const person = new Person({
    name,
    number,
    email: email || '',
    category: category || 'Other',
    notes: notes || '',
    secondaryNumber: secondaryNumber || '',
    address: address || '',
    company: company || '',
    jobTitle: jobTitle || '',
    birthday: birthday || null,
    tags: tags || [],
    favorite: favorite || false,
    user: req.user._id
  })

  person.save()
    .then(savedPerson => {
      return Person.findById(savedPerson._id)
        .populate('user', 'username firstName lastName')
    })
    .then(populatedPerson => {
      res.json(populatedPerson)
    })
    .catch(e => next(e))
})

// delete a person for authenticated user
app.delete('/api/persons/:id', auth, (req, res, next) => {
  Person.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    .then(deletedPerson => {
      if (!deletedPerson) {
        return res.status(404).json({ error: 'Person not found' })
      }
      res.status(204).end()
    })
    .catch(e => next(e))
})

// updating person for authenticated user
app.put('/api/persons/:id', auth, (req, res, next) => {
  const {
    name,
    number,
    email,
    category,
    notes,
    secondaryNumber,
    address,
    company,
    jobTitle,
    birthday,
    tags,
    favorite
  } = req.body

  const updateData = {
    ...(name && { name }),
    ...(number && { number }),
    ...(email !== undefined && { email }),
    ...(category && { category }),
    ...(notes !== undefined && { notes }),
    ...(secondaryNumber !== undefined && { secondaryNumber }),
    ...(address !== undefined && { address }),
    ...(company !== undefined && { company }),
    ...(jobTitle !== undefined && { jobTitle }),
    ...(birthday !== undefined && { birthday }),
    ...(tags !== undefined && { tags }),
    ...(favorite !== undefined && { favorite }),
    updatedAt: new Date()
  }

  Person.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updateData,
    {
      new: true,
      runValidators: true,
      context: 'query'
    })
    .populate('user', 'username firstName lastName')
    .then(person => {
      if (!person) {
        return res.status(404).json({ error: 'Person not found' })
      }
      res.json(person)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})