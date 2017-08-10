const scrape = require('./lib/scrape')
const mail = require('./lib/mail')
const latest = require('./lib/latest')

const main = async () => {
  await scrape()
  const listings = await latest()
  if (listings.length) await mail(listings)
  process.exit()
}

main().catch(console.error)
