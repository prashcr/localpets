const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Customer must have a name and email, but other fields can be left blank to indicate lack of preference
const CustomerSchema = new Schema({
  name: {type: String, required: true},
  prefMinAge: Number,
  prefMaxAge: Number,
  prefSpecies: [String],
  prefBreeds: [String]
})

module.exports = mongoose.model('Customer', CustomerSchema)
