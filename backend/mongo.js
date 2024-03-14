const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://juhapekkajvirtanen:${password}@cluster0.kctvcox.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
  id: Math.floor(Math.random() * 100),
})

if (process.argv.length < 4) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then((result) => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    )
    mongoose.connection.close()
  })
}
