const db = require('./db')
const _ = require('lodash')

module.exports = async () => {
  const listings = await db.listings()
  const latestListings = await listings
    .find()
    .sort({ scrapedOn: -1 })
    .limit(200)
    .toArray()
  return _.sortBy(latestListings, listing => -listing.rent).reverse()
}
