const app = require('./app') // Real express application
const config = require('./utils/config')

const PORT = config.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
