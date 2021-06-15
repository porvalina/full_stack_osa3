// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://fullstack:<qwerty123>@cluster0.sb6eo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phonenumber = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.sb6eo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  phonenumber: String,
  id: Number,
})

const Persons = mongoose.model('Person', personSchema)

if (name == undefined) {
    Persons.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.phonenumber} `)
        })
        mongoose.connection.close()
      })
} else {
    const person = new Persons({
        name: name,
        phonenumber: phonenumber,
        id: 0,
    })
    
    person.save().then(response => {
      console.log(` added ${name} number ${phonenumber} to phonebook `)
      mongoose.connection.close()
    })
    
}

