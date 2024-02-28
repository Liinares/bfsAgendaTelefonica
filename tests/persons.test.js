const mongoose = require('mongoose')
const Person = require('../models/Person')
const { server } = require('../index')
const { initialPersons, api, getAllNamesFromPersons } = require('./helper')

beforeEach(async () => {
  await Person.deleteMany({}) // delete all Person in test database

  // Create an inital state of database
  const person1 = new Person(initialPersons[0])
  await person1.save()
  const person2 = new Person(initialPersons[1])
  await person2.save()
}, 10000)

test('notes are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 10000)

test('there are two notes', async () => {
  const response = await api.get('/api/persons')
  expect(response.body).toHaveLength(initialPersons.length)
}, 10000)

test('the first person is Fran', async () => {
  const names = (await getAllNamesFromPersons()).names

  expect(names).toContain('Fran')
}, 10000)

test('a valid person can be added', async () => {
  const newPerson = {
    name: 'NuevaPersona',
    number: '142-3453325'
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const { names, response } = await getAllNamesFromPersons()

  expect(response.body).toHaveLength(initialPersons.length + 1)
  expect(names).toContain(newPerson.name)
}, 10000)

test('a person without name cant be added', async () => {
  const newPerson = {
    number: '142-3453325'
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(400)
    .expect('Content-Type', /application\/json/)
}, 10000)

test('a person can be deleted', async () => {
  const { response: firstResponse } = await getAllNamesFromPersons()
  const { body: persons } = firstResponse
  const personToDelete = persons[0]

  await api
    .delete(`/api/persons/${personToDelete.id}`)
    .expect(204)

  const { response: secondResponse } = await getAllNamesFromPersons()
  expect(secondResponse.body).toHaveLength(initialPersons.length - 1)
})

test('delete with incorrect id returns 400 ', async () => {
  const id = '2142'

  await api
    .delete(`/api/persons/${id}`)
    .expect(400)
})

test('a person name and phone can be changed', async () => {
  const { response: firstResponse } = await getAllNamesFromPersons()
  const { body: persons } = firstResponse
  const personToEdit = persons[0]

  const editedPerson = {
    name: 'Francho',
    number: '12-111111'
  }

  await api
    .put(`/api/persons/${personToEdit.id}`)
    .send(editedPerson)
    .expect(200)
    .then(response => {
      expect(response.body.name).toBe(editedPerson.name)
      expect(response.body.number).toBe(editedPerson.number)
    })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
