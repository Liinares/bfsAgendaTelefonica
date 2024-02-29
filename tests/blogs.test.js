const mongoose = require('mongoose')
const Blog = require('../models/Blog')
const { api, initialBlogs } = require('./helper')

beforeEach(async () => {
  await Blog.deleteMany({}) // delete all blogs in test database

  // Create an inital state of database
  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promises = blogObjects.map(blog => blog.save())
  await Promise.all(promises)
}, 10000)

describe('GET blogs', () => {
  test('there are as many persons as inigialBlogs', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialBlogs.length)
  }, 10000)

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)
})

afterAll(() => {
  mongoose.connection.close()
})
