const adjustedRent = listing =>
  (listing.noFee
    ? listing.rent
    : 0.10 * (listing.rent * 12) / 12 + listing.rent)

const problematic = listing =>
  adjustedRent(listing) <= 1500 || adjustedRent(listing) >= 5000

module.exports = { adjustedRent, problematic }
