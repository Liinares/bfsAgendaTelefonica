const supertest = require('supertest')
const mongoose = require('mongoose')
const { app, server } = require('../index')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 10000)

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
