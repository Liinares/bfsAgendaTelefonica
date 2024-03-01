const mongoose = require('mongoose')
const User = require('../models/User')
const { api, getUsers } = require('./helper')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({}) // delete all users in test database

  const passwordHash = await bcrypt.hash('initialPassword', 10)
  const user = new User({
    username: 'testUsername',
    name: 'name',
    passwordHash
  })

  await user.save()
}, 10000)

describe('POST users', () => {
  test('a valid user can be created', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'newUser',
      name: 'newusername',
      password: 'passwordUsername'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'testUsername',
      name: 'newname',
      password: 'passwordUsername'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
