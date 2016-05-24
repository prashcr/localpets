'use strict'
const path = require('path')
const PROTO_PATH = path.join(__dirname, 'protos/localpets.proto')
const grpc = require('grpc')
const {localpets} = grpc.load(PROTO_PATH)
const mongoose = require('mongoose')
const Customer = require('./models/Customer')
const Pet = require('./models/Pet')
const serialize = require('./lib/serializeDoc')

mongoose.connect('mongodb://localhost:27017/localpets')

function createCustomer (call, callback) {
  Customer.saveItem(call.request, (err, doc) => {
    if (err) {
      console.error(err)
      return callback(err, null)
    }
    callback(null, serialize(doc))
  })
}

function createPet (call, callback) {
  Pet.saveItem(call.request, (err, doc) => {
    if (err) {
      console.error(err)
      return callback(err, null)
    }
    callback(null, serialize(doc))
  })
}

function getCustomer (call, callback) {
  Customer.findById(call.request._id, (err, doc) => {
    if (err) {
      console.error(err)
      return callback(err, null)
    }
    callback(null, serialize(doc))
  })
}

function getPet (call, callback) {
  Pet.findById(call.request._id, (err, doc) => {
    if (err) {
      console.error(err)
      return callback(err, null)
    }
    callback(null, serialize(doc))
  })
}

function listCustomers (call) {
  const stream = Customer.find().stream()
  stream
    .on('data', (doc) => call.write(doc))
    .on('error', (err) => call.end(err))
    .on('close', () => call.end())
}

function listPets (call) {
  const stream = Pet.find().stream()
  stream
    .on('data', (doc) => call.write(doc))
    .on('error', (err) => call.end(err))
    .on('close', () => call.end())
}

function findCustomers (call) {
  call.write({})
  call.end()
}

function findPets (call) {
  call.write({})
  call.end()
}

function deleteCustomer (call, callback) {
  const {_id} = call.request
  Customer.remove({_id}, (err) => {
    if (err) {
      console.error(err)
      return callback(err, null)
    }
    callback(null, {})
  })
}

function deletePet (call, callback) {
  const {_id} = call.request
  Pet.remove({_id}, (err) => {
    if (err) {
      console.error(err)
      return callback(err, null)
    }
    callback(null, {})
  })
}

function adoptPet (call, callback) {
  const {pet, customer} = call.request
  Pet.findByIdAndUpdate(pet._id, {$set: {adoptedBy: customer._id}}, (err, doc) => {
    if (err) {
      console.error(err)
      return callback(err, null)
    }
    callback(null, serialize(doc))
  })
}

function getServer () {
  const server = new grpc.Server()
  server.addProtoService(localpets.LocalPets.service, {
    createCustomer,
    createPet,
    getCustomer,
    getPet,
    listCustomers,
    listPets,
    findCustomers,
    findPets,
    deleteCustomer,
    deletePet,
    adoptPet
  })
  return server
}

const server = getServer()
server.bind('0.0.0.0:26570', grpc.ServerCredentials.createInsecure())
server.start()
console.log('gRPC server started at localhost:26570')
