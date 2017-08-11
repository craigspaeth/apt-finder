module.exports.adjustedRent = listing =>
  (listing.noFee ? listing.rent : 0.10 * (listing.rent * 12))
