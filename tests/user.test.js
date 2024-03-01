const mongoose = require('mongoose')
const User = require('../models/User')
const { api, getUsers } = require('./helper')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({}) // delete all users in test database

  const passwordHash = await bcrypt.hash('initialPassword', 10)
  const user = new User({
    username: 'linaresmiguel26',
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
})

afterAll(() => {
  mongoose.connection.close()
})
