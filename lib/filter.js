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
