require('./mongo')

const Person = require('./models/Person')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const unknownEndpoint = require('./unknownEndpointMiddleware')

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

let persons = []

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

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log('id: ', id)
  const person = persons.find(person => person.id === id)

  if (person) {
    console.log('encontrado')

    response.send(person)
  } else {
    console.log('no encontrado')

    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person || !person.name || !person.number) {
    return response.status(400).json({
      error: 'Person name or person number is missing'
    })
  }

  const existingPerson = persons.find(pers => pers.name === person.name)

  if (existingPerson) {
    return response.status(400).json({
      error: 'Person name already exists'
    })
  }

  const ids = persons.map(person => person.id)
  const maxId = Math.max(...ids)

  const newPerson = {
    id: maxId + 1,
    name: person.name,
    number: person.number
  }

  persons = [...persons, newPerson]

  response.status(201).json(newPerson)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
