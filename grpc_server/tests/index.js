'use strict'

const path = require('path')
const PROTO_PATH = path.join(__dirname, '../protos/localpets.proto')
const grpc = require('grpc')
const {localpets} = grpc.load(PROTO_PATH)
const client = new localpets.LocalPets('localhost:26570', grpc.credentials.createInsecure())
const mongoose = require('mongoose')
const test = require('tape')

test('create customer', t => {
  t.plan(1)

  const customer = {
    name: 'John Doe',
    prefBreeds: ['Cockerspaniel', 'Alaskan Malamute'],
    prefSpecies: ['turtle', 'cat'],
    prefMaxAge: 6
  }
  client.createCustomer(customer, (err, doc) => {
    if (err) {
      return t.error(err, 'no error')
    }
    t.deepEqual(customer.prefBreeds, doc.prefBreeds, 'attribute should be equivalent')
  })
})

test('create pet', t => {
  t.plan(1)

  const pet = {
    name: 'Nymeria',
    species: 'Direwolf',
    age: 5
  }
  client.createPet(pet, (err, doc) => {
    if (err) {
      return t.error(err, 'no error')
    }
    t.deepEqual(pet.species, doc.species, 'attribute should be equivalent')
  })
})

test('get customer', t => {
  t.plan(1)

  const customer = {name: 'Viserys'}
  client.createCustomer(customer, (err, doc) => {
    if (err) {
      return t.error(err, 'no error')
    }
    const {_id} = doc
    client.getCustomer({_id}, (err, doc) => {
      if (err) {
        return t.error(err, 'no error')
      }
      t.equal(customer.name, doc.name, 'attribute should be equivalent')
    })
  })
})

test('get pet', t => {
  t.plan(1)

  const pet = {species: 'cat', age: 5}
  client.createPet(pet, (err, doc) => {
    if (err) {
      return t.error(err, 'no error')
    }
    const {_id} = doc
    client.getPet({_id}, (err, doc) => {
      if (err) {
        return t.error(err, 'no error')
      }
      t.equal(pet.species, doc.species, 'attribute should be equivalent')
    })
  })
})

test('list customers', t => {
  t.plan(1)

  const stream = client.listCustomers({})
  const customers = []
  stream
    .on('data', doc => customers.push(doc))
    .on('error', err => t.error(err, 'no error'))
    .on('end', () => {
      const [first] = customers
      t.ok(first.name.length > 0, 'first customer should have a name')
    })
})

test('list pets', t => {
  t.plan(1)

  const stream = client.listPets({})
  const pets = []
  stream
    .on('data', doc => pets.push(doc))
    .on('error', err => t.error(err, 'no error'))
    .on('end', () => {
      const [first] = pets
      t.ok(first.species.length > 0, 'first pet should have a species')
    })
})

test.skip('find matching customers for first pet', t => {
  t.plan(2)

  const petStream = client.listPets({limit: 1})
  const pets = []
  petStream
    .on('data', doc => pets.push(doc))
    .on('error', err => t.error(err, 'no error'))
    .on('end', () => {
      t.equal(pets.length, 1, 'only one pet should be returned')
      const [firstPet] = pets
      const firstPetId = mongoose.Types.ObjectId(firstPet._id)
      const customers = []
      const customerStream = client.findCustomers({_id: firstPetId})
      customerStream
        .on('data', doc => customers.push(doc))
        .on('error', err => t.error(err, 'no error'))
        .on('end', () => {
          const [firstCustomer] = customers
          t.ok(firstCustomer.name.length > 0, 'first customer found should have a name')
        })
    })
})

test.skip('find matching pets for first customer', t => {
  t.plan(2)

  const customerStream = client.listCustomers({limit: 1})
  const customers = []
  customerStream
    .on('data', doc => customers.push(doc))
    .on('error', err => t.error(err, 'no error'))
    .on('end', () => {
      t.equal(customers.length, 1, 'only one customer should be returned')
      const [firstCustomer] = customers
      const firstCustomerId = mongoose.Types.ObjectId(firstCustomer._id)
      const pets = []
      const petStream = client.findPets({_id: firstCustomerId})
      petStream
        .on('data', doc => pets.push(doc))
        .on('error', err => t.error(err, 'no error'))
        .on('end', () => {
          const [firstPet] = pets
          t.ok(firstPet.species.length > 0, 'first pet found should have a species')
        })
    })
})

test('delete first customer', t => {
  t.plan(2)

  const customerStream = client.listCustomers({limit: 1})
  const customers = []
  customerStream
    .on('data', doc => customers.push(doc))
    .on('error', err => t.error(err, 'no error'))
    .on('end', () => {
      t.equal(customers.length, 1, 'only one customer should be returned')
      const [firstCustomer] = customers
      client.deleteCustomer({_id: firstCustomer._id}, err => {
        t.error(err, 'no error')
      })
    })
})

test('delete first pet', t => {
  t.plan(2)

  const petStream = client.listPets({limit: 1})
  const pets = []
  petStream
    .on('data', doc => pets.push(doc))
    .on('error', err => t.error(err, 'no error'))
    .on('end', () => {
      t.equal(pets.length, 1, 'only one pet should be returned')
      const [firstPet] = pets
      client.deletePet({_id: firstPet._id}, err => {
        t.error(err, 'no error')
      })
    })
})

test('new customer adopts new pet', t => {
  t.plan(1)

  const customer = {
    name: 'Jon Snow',
    prefBreeds: ['Direwolf', 'Alaskan Malamute'],
    prefSpecies: ['turtle', 'cat'],
    prefMaxAge: 6
  }
  client.createCustomer(customer, (err, doc) => {
    if (err) {
      return t.error(err, 'no error')
    }
    const customerId = doc._id
    const pet = {
      name: 'Shadow',
      species: 'Direwolf',
      age: 15
    }
    client.createPet(pet, (err, doc) => {
      if (err) {
        return t.error(err, 'no error')
      }
      const petId = doc._id
      client.adoptPet({pet: {_id: petId}, customer: {_id: customerId}}, (err, doc) => {
        if (err) {
          return t.error(err, 'no error')
        }
        t.equal(doc.adoptedBy, customerId, 'pet should be adopted by customer')
      })
    })
  })
})
