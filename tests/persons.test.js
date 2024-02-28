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

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
