'use strict'

const path = require('path')
const PROTO_PATH = path.join(__dirname, '../protos/localpets.proto')
const grpc = require('grpc')
const {localpets} = grpc.load(PROTO_PATH)
const client = new localpets.LocalPets('localhost:26570',
  grpc.credentials.createInsecure())
const test = require('tape')

test('create customer', t => {
  t.plan(2)

  const customer = {
    name: 'John Doe',
    prefBreeds: ['Cockerspaniel', 'Alaskan Malamute'],
    prefSpecies: ['turtle', 'cat'],
    prefMaxAge: 6
  }

  client.createCustomer(customer, (err, res) => {
    t.error(err, 'err is falsy')
    t.deepEqual(customer.prefSpecies, res.prefSpecies, 'saved document is equivalent')
  })
})

test('create pet', t => {
  t.plan(2)

  const pet = {
    name: 'Nymeria',
    breed: 'Direwolf',
    age: 15
  }

  client.createPet(pet, (err, res) => {
    t.error(err, 'err is falsy')
    t.equal(pet.name, res.name, 'saved document is equivalent')
  })
})

// TODO finish tests

test('get customer', t => {
  t.plan(1)

  t.equal(true, true, 'true is true')
})

test('get pet', t => {
  t.plan(1)

  t.equal(true, true, 'true is true')
})

test('list customers', t => {
  t.plan(1)

  t.equal(true, true, 'true is true')
})

test('list pets', t => {
  t.plan(1)

  t.equal(true, true, 'true is true')
})

test('find matching customers', t => {
  t.plan(1)

  t.equal(true, true, 'true is true')
})

test('find matching pets', t => {
  t.plan(1)

  t.equal(true, true, 'true is true')
})

test('delete customer', t => {
  t.plan(1)

  t.equal(true, true, 'true is true')
})

test('delete pet', t => {
  t.plan(1)

  t.equal(true, true, 'true is true')
})

test('adopt pet', t => {
  t.plan(1)

  t.equal(true, true, 'true is true')
})
