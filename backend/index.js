require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person.js')

app.use(
  cors({
    origin: ['http://localhost:3001', process.env.ORIGIN],
  })
)

morgan.token('req-body', (req) =>
  JSON.stringify({ name: req.body.name, number: req.body.number })
)
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body[]'
  )
)
app.use(express.json())
app.use(express.static('build'))

{
  /*let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]
*/
}
const errorHandler = (error, request, response, next) => {
  console.log('Is the error visible?', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((person) => {
    res.json(person)
  })
})

app.get('/info', (request, response) => {
  Person.countDocuments()
    .then((count_documents) => {
      console.log(count_documents)
      const timestamp = new Date().toString()

      response.send(
        `Phonebook has info for ${count_documents} people <br> <br> ${timestamp}`
      )
    })
    .catch((error) => {
      console.log('Error:', error)
      response.status(500).send('Error')
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})
{
}

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      console.log('Delete succesful!')
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing',
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'Number missing',
    })
  }

  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person
    .save()
    .then((savedPerson) => {
      console.log('person saved!')
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: body.number })
    .then((updatedNumber) => {
      response.json(updatedNumber)
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
