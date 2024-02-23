const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// conexión a mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.log(err)
  })
