const personsRouter = require('express').Router()
const Person = require('../models/Person')

personsRouter.get('/', (request, response) => {
  Person.find({})
    .then(notes => {
      response.json(notes)
    })
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

personsRouter.post('/', (request, response, next) => {
  const person = request.body

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  newPerson.save()
    .then(savedPerson => {
      response.status(201).json(savedPerson)
    })
    .catch(err => {
      next(err)
    })
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
