const mongoose = require('mongoose')
const User = require('../models/User')
const { api, getUsers, getInitialUsers } = require('./helper')

beforeEach(async () => {
  await User.deleteMany({}) // delete all users in test database

  const initialUsers = await getInitialUsers()
  const userObjects = initialUsers.map(user => new User(user))
  const promisesUsers = userObjects.map(user => user.save())
  await Promise.all(promisesUsers)
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
      username: usersAtStart[0].username,
      name: usersAtStart[0].name,
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
