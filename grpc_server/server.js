'use strict'
const path = require('path')
const PROTO_PATH = path.join(__dirname, 'protos/localpets.proto')
const grpc = require('grpc')
const {localpets} = grpc.load(PROTO_PATH)
const mongoose = require('mongoose')
const Customer = require('./models/Customer')
const Pet = require('./models/Pet')

mongoose.connect('mongodb://localhost:27017/localpets')

function createCustomer (call, callback) {
  const customer = new Customer(call.request)
  customer.save((err, doc) => {
    if (err) {
      return callback(err, null)
    }
    callback(null, doc)
  })
}

function createPet (call, callback) {
  const pet = new Pet(call.request)
  pet.save((err, doc) => {
    if (err) {
      return callback(err, null)
    }
    callback(null, doc)
  })
}

function findCustomers (call) {
  Customer.find()
  call.write({})
  call.end()
}

function findPets (call) {
  Pet.find({})
  call.write({})
  call.end()
}

function adoptPet (call, callback) {
  call.write({})
  call.end()
}

function getServer () {
  const server = new grpc.Server()
  server.addProtoService(localpets.LocalPets.service, {
    createCustomer,
    createPet,
    findCustomers,
    findPets,
    adoptPet
  })
  return server
}

const server = getServer()
server.bind('0.0.0.0:26570', grpc.ServerCredentials.createInsecure())
server.start()
console.log('gRPC server started at localhost:26570')
