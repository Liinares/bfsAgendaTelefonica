const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const config = require('../utils/config')

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

  const userForToken = {
    id: user._id,
    username: user.username
  }

  const token = jwt.sign(
    userForToken,
    config.SECRET,
    {
      expiresIn: 60 * 60 * 24 * 7
    })

  response.status(200).send({
    name: user.name,
    username: user.username,
    token
  })
})

module.exports = loginRouter
