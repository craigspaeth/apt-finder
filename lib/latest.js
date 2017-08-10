const moment = require('moment')
const db = require('./db')
const _ = require('lodash')

const { MAX_RENT: MR } = process.env
const MAX_RENT = Number(MR)

module.exports = async () => {
  const latestListings = await db.listings.find({
    scrapedOn: {
      $gte: moment().subtract(3, 'minutes').toDate()
    }
  })
  const realListings = _.filter(
    latestListings,
    listing =>
      Math.abs(Number(MAX_RENT) - listing.rent) <= 1000 && listing.noFee
  )
  return _.sortBy(realListings, listing => -listing.rent).reverse()
}
