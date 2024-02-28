require('./mongo') // Connection to database
const express = require('express')
const app = express()
const cors = require('cors')
const unknownEndpoint = require('./middleware/unknownEndpoint')
const handleErrors = require('./middleware/handleErrors')
const morganLogger = require('./middleware/morganLogger')
const personsRouter = require('./controllers/persons')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morganLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.use('/api/persons', personsRouter)

app.use(unknownEndpoint)
app.use(handleErrors)

module.exports = app
