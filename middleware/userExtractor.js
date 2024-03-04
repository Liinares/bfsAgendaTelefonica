const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const userExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  let token = ''
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  let decodedToken = {}
  try {
    decodedToken = jwt.verify(token, config.SECRET)
  } catch (error) { next(error) }

  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const { id: userId } = decodedToken

  console.log(userId)

  request.userId = userId

  next()
}

module.exports = userExtractor
