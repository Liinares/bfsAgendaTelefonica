const unknownEndpoint = (request, response) => {
  response.status(404).json({
    error: 'Endpoint not found'
  })
}

module.exports = unknownEndpoint
