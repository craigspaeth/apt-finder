const scrape = require('./scrape')

const main = async () => {
  await scrape()
  process.exit()
}

main().catch(console.error)
