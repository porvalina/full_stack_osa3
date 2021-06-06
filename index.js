const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
app.use(
    morgan(':method :url :status :res[content-length] :body - :response-time ms')
)
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(cors())
app.use(express.json())
let persons = [
          {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 1
          },
          {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 2
          },
          {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": 3
          },
        ]

app.get('/', (req, res) => {
  res.json(persons)
  
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()} </p>`)

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.get('/api/persons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const person = persons.find(person => person.id === id)
    res.json(person)
  })

app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
      }

    const sameNamePersonsArray = persons.filter((p) => {
        return p.name.toUpperCase().indexOf(request.body.name.toUpperCase()) != -1
      })
  
      if (sameNamePersonsArray.length > 0) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
        }

    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id)) 
      : 0
  
    const person = request.body
    person.id = maxId + 1
  
    persons = persons.concat(person)
  
    response.json(person)
  })

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})