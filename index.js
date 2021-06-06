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
            "phonenumber": "39-44-5323523",
            "id": 1
          },
          {
            "name": "Dan Abramov",
            "phonenumber": "12-43-234345",
            "id": 2
          },
          {
            "name": "Mary Poppendieck",
            "phonenumber": "39-23-6423122",
            "id": 3
          },
        ]


app.use(express.static('build'))

const baseUrl = '/api/persons'

app.get(baseUrl, (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()} </p>`)

})

app.delete(`${baseUrl}/:id`, (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.get(`${baseUrl}/:id`, (req, res) => {
    const id = parseInt(req.params.id)
    const person = persons.find(person => person.id === id)
    res.json(person)
  })

app.post(baseUrl, (request, response) => {
    if (!request.body.name || !request.body.phonenumber) {
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