const scrape = require('./scrape')
const mail = require('./mail')
const latest = require('./latest')

const main = async () => {
  await scrape()
  const listings = await latest()
  if (listings.length) await mail(listings)
  process.exit()
}

main().catch(console.error)
