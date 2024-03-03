const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

loginRouter.post('/', async (request, response, next) => {
  const { body } = request
  const { username, password } = body
  const user = await User.findOne({ username })

  if (!user) {
    response.status(401).json({
      error: 'invalid user or password'
    })
  }

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    response.status(401).json({
      error: 'invalid user or password'
    })
  }

  response.status(200).send({
    name: user.name,
    username: user.username
  })
})

module.exports = loginRouter
