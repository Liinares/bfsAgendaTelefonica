const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/info', (request, resposne) => {
  const res = `<p>Phonebook has info for ${persons.length} persons</p>
    <p> ${new Date()} </p>`

  resposne.send(res)
})

app.get('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    console.log("id: ", id)
    const person = persons.find(person => person.id === id)
    
    if (person){
        console.log("encontrado")
        
        response.send(person)
    } else{
        console.log("no encontrado")

        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)    
        
    response.status(204).end()
})

app.post('/api/persons',(request, response) => {
  const person = request.body;

  if (!person || !person.name || !person.number) {
    return response.status(400).json({
      error: 'Person name or person number is missing'
    })
  }

  const existingPerson = persons.find(pers => pers.name === person.name)

  if (existingPerson) {
    return response.status(400).json({
      error: 'Person name already exists'
    })
  }

  const ids = persons.map(person => person.id)
  const maxId = Math.max(...ids)

  const newPerson = {
    id: maxId + 1,
    name: person.name,
    number: person.number
  }

  persons = [...persons, newPerson ]

  response.status(201).json(newPerson)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) 