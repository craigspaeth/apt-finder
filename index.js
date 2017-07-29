const Nightmare = require('nightmare')
const pmongo = require('promised-mongo')
const accounting = require('accounting')
const cheerio = require('cheerio')
const moment = require('moment')
const _ = require('lodash')

let { BEDS, MAX_RENT, DEBUG, DB_URL, TIMEOUT } = process.env
DEBUG = Boolean(DB_URL)
TIMEOUT = Number(TIMEOUT)
const STREET_EASY_URL = `http://streeteasy.com/for-rent/prospect-heights/price:-${MAX_RENT}%7Cbeds:${BEDS}`

const db = pmongo(DB_URL, ['listings'])
const nightmare = Nightmare({
  show: DEBUG,
  waitTimeout: TIMEOUT,
  gotoTimeout: TIMEOUT,
  loadTimeout: TIMEOUT,
  executionTimeout: TIMEOUT
})

const main = async () => {
  const listings = _.flatten(await Promise.all([scrapeStreetEasy()]))
  console.log(listings)
}

const scrapeStreetEasy = async () => {
  const html = await nightmare
    .goto(STREET_EASY_URL)
    .wait(() => !!document.body.querySelector('#result-details'))
    .evaluate(() => document.body.innerHTML)
    .end()
  const $ = cheerio.load(html)
  const listings = $('#result-details .item:not(.featured)')
    .map((i, el) => ({
      uid: $(el).attr('id'),
      thumbnail: $(el).find('.photo img').attr('src'),
      rent: accounting.unformat($(el).find('.price').text()),
      noFee: $(el).find('.no_fee').length,
      scrapedOn: moment().format()
    }))
    .get()
  return listings
}

main().catch(console.error)
