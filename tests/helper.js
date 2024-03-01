const supertest = require('supertest')
const User = require('../models/User')
const { app } = require('../index')

const api = supertest(app)

const initialPersons = [
  {
    name: 'Fran',
    number: '12-214123'
  },
  {
    name: 'Alex',
    number: '12-431351'
  }
]

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

const getAllNamesFromPersons = async () => {
  const response = await api.get('/api/persons')

  const names = response.body.map(person => person.name)

  return {
    names,
    response
  }
}

const getAllAuthorsFromBlogs = async () => {
  const response = await api.get('/api/blogs')

  const authors = response.body.map(blog => blog.author)

  return {
    authors,
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  const users = usersDB.map(user => user.toJSON())

  return users
}

module.exports = {
  initialPersons,
  initialBlogs,
  api,
  getAllNamesFromPersons,
  getAllAuthorsFromBlogs,
  getUsers
}
