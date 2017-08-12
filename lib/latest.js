const moment = require('moment')
const db = require('./db')
const _ = require('lodash')

module.exports = async () => {
  const listings = await db.listings()
  const latestListings = await listings
    .find({
      scrapedOn: {
        $gte: moment().subtract(5, 'days').toDate()
      }
    })
    .sort({ scrapedOn: -1 })
    .limit(500)
    .toArray()
  return _.sortBy(latestListings, listing => -listing.rent).reverse()
}
