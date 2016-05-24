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

PetSchema.statics.saveItem = require('../lib/saveItem')

module.exports = mongoose.model('Pet', PetSchema)
