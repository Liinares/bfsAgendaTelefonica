const personsRouter = require('express').Router()
const Person = require('../models/Person')

personsRouter.get('/', async (request, response) => {
  const notes = await Person.find({})

  response.json(notes)
})

personsRouter.get('/:id', (request, response, next) => {
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

personsRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params

  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => { next(error) })
})

personsRouter.post('/', async (request, response, next) => {
  const person = request.body

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  try {
    const savedPerson = await newPerson.save()
    response.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

personsRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const person = request.body

  console.log(person)

  const newPerson = {
    name: person.name,
    number: person.number
  }

  Person.findByIdAndUpdate(id, newPerson, {
    new: true,
    runValidators: true,
    conext: 'query'
  })
    .then(result => {
      response.json(result)
    })
    .catch(error => { next(error) })
})

module.exports = personsRouter
