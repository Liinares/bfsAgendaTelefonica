require('dotenv').config()
require('./mongo')
const Person = require('./models/Person')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const unknownEndpoint = require('./middleware/unknownEndpoint')
const handleErrors = require('./middleware/handleErrors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res), 'ms',
    'Body:', JSON.stringify(req.body)
  ].join(' ')
}))

const persons = []

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(notes => {
      response.json(notes)
    })
})

app.get('/info', (request, resposne) => {
  const res = `<p>Phonebook has info for ${persons.length} persons</p>
    <p> ${new Date()} </p>`

  resposne.send(res)
})

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findById(id)
    .then(person => {
      if (person) {
        console.log('encontrado')
        response.send(person)
      } else {
        console.log('no encontrado')
        response.status(404).end()
      }
    })
    .catch(err => { next(err) })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => { next(error) })
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person || !person.name || !person.number) {
    return response.status(400).json({
      error: 'Person name or number is missing'
    })
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  newPerson.save()
    .then(savedPerson => {
      response.status(201).json(savedPerson)
    })
    .catch(err => {
      console.log(err)
      response.status(400).json({
        error: 'Error in database'
      })
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const person = request.body

  console.log(person)

  const newPerson = {
    name: person.name,
    number: person.number
  }

  Person.findByIdAndUpdate(id, newPerson, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(error => { next(error) })
})

app.use(unknownEndpoint)
app.use(handleErrors)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
