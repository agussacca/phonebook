const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

if (process.argv.length>5) {
    console.log('too many arguments')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://agustinsacca59:${password}@cluster0.nsycxvi.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<4) {
    console.log('Phonebook: ')
    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note.name, note.number)
        })
        mongoose.connection.close()
      })
    .catch(error => {
        console.error('Error fetching persons:', error);
        mongoose.connection.close();
    })
}
else {
    const name = process.argv[3]
    const number = process.argv[4]

    if (!name || !number) {
        console.log('Missing name or number')
        mongoose.connection.close()
        return
    }

    const person = new Person({
        "name": name, 
        "number": number
    })

    person.save().then(result => {
        console.log(`Added ${name} number: ${number} to phonebook`)
        mongoose.connection.close()
    })
    .catch(error => {
        console.error('Error saving person:', error);
        mongoose.connection.close();
    })
}

