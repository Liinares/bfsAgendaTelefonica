const blogRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
      _id: 0
    })

    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', userExtractor, async (request, response, next) => {
  const {
    title,
    author,
    url,
    likes
  } = request.body

  const { userId } = request

  const user = await User.findById(userId)

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  try {
    const result = await blog.save()

    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params

  try {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) { next(error) }
})

blogRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const blog = request.body

  console.log('id', id)
  console.log('blog', blog)

  const newBlog = {
    title: blog.title,
    url: blog.url,
    likes: blog.likes
  }

  try {
    const result = await Blog.findByIdAndUpdate(id, newBlog, {
      new: true,
      runValidators: true,
      conext: 'query'
    })

    console.log(result)

    response.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter
