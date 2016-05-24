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
  // Fix Protobuf.js automatically setting empty string as value for unset fields
  item = omitBy(item, isEmpty)
  // for (let key in item) {
  //   if (item[key] === '' || item[key] === []) delete item[key]
  // }
  ;(new this(item)).save(callback)
}

module.exports = mongoose.model('Customer', CustomerSchema)
