'use strict'

// Convert MongoDB doc to Protobuf-friendly object
module.exports = doc => {
  doc = doc.toObject({versionKey: false})
  if (doc.hasOwnProperty('availableFrom')) {
    doc.availableFrom = doc.availableFrom.valueOf()
  }
  if (doc.hasOwnProperty('_id')) {
    doc._id = doc._id.toString()
  }
  return doc
}
