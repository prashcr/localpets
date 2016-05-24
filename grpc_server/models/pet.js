'use strict'

const omitBy = require('lodash.omitby')
const isEmpty = require('lodash.isempty')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Since pets may have missing information, none of the fields are required
const PetSchema = new Schema({
  name: String,
  age: Number,
  availableFrom: {type: Date, default: Date.now()},
  species: String,
  breed: String,
  adoptedBy: String
})

// Custom constructor defined as a static method that instantiates and saves in one step
PetSchema.statics.saveItem = function (item, callback) {
  // Disallow setting custom _id
  delete item._id
  // Fix Protobuf.js automatically setting empty string as value for unset fields
  item = omitBy(item, isEmpty)
  // for (let key in item) {
  //   if (item[key] === '' || item[key] === []) delete item[key]
  // }
  ;(new this(item)).save(callback)
}

module.exports = mongoose.model('Pet', PetSchema)
