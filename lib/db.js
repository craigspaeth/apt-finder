const { MongoClient } = require('mongodb')
const { MONGODB_URI } = process.env

let db

module.exports.listings = async () => {
  if (!db) db = await MongoClient.connect(MONGODB_URI)
  return db.collection('listings')
}
