const ERROR_HANDLERS = {
  CastError: (res, error) => {
    res.status(400).send({
      error: 'id used is malformed'
    })
  },
  ValidationError: (res, error) => {
    res.status(400).json({
      error: error.message
    })
  },
  JsonWebTokenError: (res, error) => {
    res.status(401).json({ error: 'token missing or invalid' })
  },
  defaultError: res => res.status(500).end()
}

const handleErrors = (error, request, response, next) => {
  console.log('HANDLE ERRORS')
  console.log(error.name)
  console.error(error)

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(response, error)
}

module.exports = handleErrors
