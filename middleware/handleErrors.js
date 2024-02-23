const handleErrors = (error, request, response) => {
  // console.log(error)

  if (error.name === 'CastError') {
    response.status(400).send({
      error: 'id used is malformed'
    })
  } else {
    response.status(500).end()
  }
}

module.exports = handleErrors
