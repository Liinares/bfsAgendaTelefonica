const unknownEndpoint = (request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
}

module.exports = unknownEndpoint
