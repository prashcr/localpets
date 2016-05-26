'use strict'

const omitBy = require('lodash.omitby')
const isEmpty = require('lodash.isempty')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Customer must have a name, but other fields can be left blank to indicate lack of preference
const CustomerSchema = new Schema({
  name: {type: String, required: true},
  prefMinAge: Number,
  prefMaxAge: Number,
  prefSpecies: [String],
  prefBreeds: [String]
})

// Custom constructor defined as a static method that instantiates and saves in one step
CustomerSchema.statics.saveItem = function (item, callback) {
  // Disallow setting custom _id
  delete item._id
  // Protobuf.js automatically sets empty string or 0 as value for unset fields depending on type
  // Revert this behavior by dropping empty fields
  item = omitBy(item, isEmpty)
  ;(new this(item)).save(callback)
}

module.exports = mongoose.model('Customer', CustomerSchema)
