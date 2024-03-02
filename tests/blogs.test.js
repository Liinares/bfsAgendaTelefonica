const mongoose = require('mongoose')
const Blog = require('../models/Blog')
const User = require('../models/User')
const { api, initialBlogs, getAllAuthorsFromBlogs, getUsers, getInitialUsers } = require('./helper')

beforeEach(async () => {
  await Blog.deleteMany({}) // delete all blogs in test database
  await User.deleteMany({}) // delete all users in test database

  // Create an inital state of database
  const initialUsers = await getInitialUsers()
  const userObjects = initialUsers.map(user => new User(user))
  const promisesUsers = userObjects.map(user => user.save())
  await Promise.all(promisesUsers)

  const users = await getUsers()

  const blogsWithUserId = initialBlogs.map(blog => {
    blog.userId = users[0].id
    return blog
  })
  const blogObjects = blogsWithUserId.map(blog => new Blog(blog))
  const promiseBlogs = blogObjects.map(blog => blog.save())
  await Promise.all(promiseBlogs)
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
    const users = await getUsers()

    const userId = users[0].id

    const blogToCreate =
    {
      title: 'Blog to create',
      author: 'Miguel A Linares',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 13,
      userId
    }

    await api
      .post('/api/blogs')
      .send(blogToCreate)
      .expect(201)

    const { authors, response } = await getAllAuthorsFromBlogs()

    expect(authors).toContain(blogToCreate.author)
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })

  test('a blog created whithout likes have 0 likes by default', async () => {
    const users = await getUsers()

    const userId = users[0].id

    const blogToCreate =
    {
      title: 'Blog to create without likes',
      author: 'Miguel A Linares',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      userId
    }

    await api
      .post('/api/blogs')
      .send(blogToCreate)
      .expect(201)

    const { response } = await getAllAuthorsFromBlogs()

    const blogCreated = response.body.find(blog => blog.title === blogToCreate.title)
    expect(blogCreated.likes).toBe(0)
  })

  test('a blog cant be created without title', async () => {
    const users = await getUsers()

    const userId = users[0].id

    const blogToCreate =
    {
      author: 'Miguel A Linares',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 12,
      userId
    }

    await api
      .post('/api/blogs')
      .send(blogToCreate)
      .expect(400)
  })

  test('a blog cant be created without url', async () => {
    const users = await getUsers()

    const userId = users[0].id

    const blogToCreate =
    {
      title: 'Blog to create',
      author: 'Miguel A Linares',
      likes: 12,
      userId
    }

    await api
      .post('/api/blogs')
      .send(blogToCreate)
      .expect(400)
  })
})

describe('DELETE blogs', () => {
  test('a blog can be deleted', async () => {
    const { response: firstResponse } = await getAllAuthorsFromBlogs()
    const { body: blogs } = firstResponse
    const personToDelete = blogs[0]

    await api
      .delete(`/api/blogs/${personToDelete.id}`)
      .expect(204)

    const { response: secondResponse } = await getAllAuthorsFromBlogs()
    expect(secondResponse.body).toHaveLength(initialBlogs.length - 1)
  })

  test('delete with incorrect id returns 400 ', async () => {
    const id = '2142'

    await api
      .delete(`/api/blogs/${id}`)
      .expect(400)
  })
})

describe('PUT blogs', () => {
  test('a blog title, name and likes can be changed', async () => {
    const { response: firstResponse } = await getAllAuthorsFromBlogs()
    const { body: blogs } = firstResponse
    const blogToEdit = blogs[0]

    const editedBlog = {
      title: 'Edited title',
      url: 'edited-url',
      likes: 12
    }

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(editedBlog)
      .expect(200)
      .then(response => {
        expect(response.body.title).toBe(editedBlog.title)
        expect(response.body.url).toBe(editedBlog.url)
        expect(response.body.likes).toBe(editedBlog.likes)
      })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
