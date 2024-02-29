const mongoose = require('mongoose')
const Blog = require('../models/Blog')
const { api, initialBlogs, getAllAuthorsFromBlogs } = require('./helper')

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

  test('blogs have id property', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  }, 10000)
})

describe('POST blogs', () => {
  test('a valid blog can be created', async () => {
    const blogToCreate =
    {
      title: 'Blog to create',
      author: 'Miguel A Linares',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 13
    }

    await api
      .post('/api/blogs')
      .send(blogToCreate)
      .expect(201)

    const { authors, response } = await getAllAuthorsFromBlogs()

    expect(authors).toContain(blogToCreate.author)
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
