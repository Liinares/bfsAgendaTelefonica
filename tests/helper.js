const supertest = require('supertest')
const { app } = require('../index')

const api = supertest(app)

const initialPersons = [
  {
    name: 'Fran',
    number: '12-214123'
  },
  {
    name: 'Alex',
    number: '12-431351'
  }
]

const getAllNamesFromPersons = async () => {
  const response = await api.get('/api/persons')

  const names = response.body.map(person => person.name)

  return {
    names,
    response
  }
}

module.exports = {
  initialPersons,
  api,
  getAllNamesFromPersons
}
