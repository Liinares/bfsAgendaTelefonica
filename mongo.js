const mongoose = require('mongoose')
require('dotenv').config()
const password = process.env.DB_PASSWORD

const connectionString = `mongodb+srv://linaresmiguel26:${password}@cluster0.vwchfne.mongodb.net/agendatelefonicabd?retryWrites=true&w=majority`

// conexión a mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.log(err)
  })
