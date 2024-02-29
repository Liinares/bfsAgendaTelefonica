const blogRouter = require('express').Router()
const Blog = require('../models/Blog')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})

    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const result = await blog.save()

    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
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
