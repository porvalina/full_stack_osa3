const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
require('dotenv').config()

const app = express()
app.use(
    morgan(':method :url :status :res[content-length] :body - :response-time ms')
)
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(cors())
app.use(express.json())

app.use(express.static('build'))

const baseUrl = '/api/persons'

app.get(baseUrl, (req, res) => {
    Person.find({}).then(result => {
        res.json(result.filter(p => p.name))
      })
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()} </p>`)

})

app.delete(`${baseUrl}/:id`, (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get(`${baseUrl}/:id`, (req, res) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
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

  app.put(`${baseUrl}/:id`, (request, res, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      phonenumber: body.phonenumber,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})