'use strict'

const omitBy = require('lodash.omitby')
const isEmpty = require('lodash.isempty')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Since pets may have missing information, only species is required
const PetSchema = new Schema({
  name: String,
  age: Number,
  availableFrom: {type: Date, default: Date.now()},
  species: {type: String, required: true},
  breed: String,
  adoptedBy: String
})

// Custom constructor defined as a static method that instantiates and saves in one step
PetSchema.statics.saveItem = function (item, callback) {
  // Disallow setting custom _id
  delete item._id
  // Protobuf.js automatically sets empty string or 0 as value for unset fields depending on type
  // Revert this behavior by dropping empty fields
  item = omitBy(item, isEmpty)
  ;(new this(item)).save(callback)
}

module.exports = mongoose.model('Pet', PetSchema)
