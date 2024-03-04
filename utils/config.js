require('dotenv').config()

const PORT = process.env.PORT
const MONGO_DB_URI = process.env.MONGO_DB_URI
const MONGO_DB_URI_TEST = process.env.MONGO_DB_URI_TEST
const NODE_ENV = process.env.NODE_ENV
const SECRET = process.env.SECRET

module.exports = {
  MONGO_DB_URI,
  PORT,
  MONGO_DB_URI_TEST,
  NODE_ENV,
  SECRET
}
