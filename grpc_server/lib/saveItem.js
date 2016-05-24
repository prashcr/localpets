// Custom constructor defined as a static method that instantiates and saves in one step
module.exports = (item, callback) => {
  // Disallow setting custom _id
  delete item._id
  // Fix Protobuf.js automatically setting empty string as value for unset fields
  for (let key in item) {
    if (item[key] === '') delete item[key]
  }
  (new this(item)).save(callback)
}
