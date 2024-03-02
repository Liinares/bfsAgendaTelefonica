const userRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response, next) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    likes: 1,
    url: 1
  })

  response.json(users)
})

userRouter.post('/', async (request, response, next) => {
  const { body } = request
  const { username, name, password } = body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = userRouter
