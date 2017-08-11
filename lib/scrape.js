const request = require('superagent')
const Nightmare = require('nightmare')
const accounting = require('accounting')
const cheerio = require('cheerio')
const _ = require('lodash')
const { parse: parseURL } = require('url')
const db = require('./db')
const listUIConfig = require('./list-ui-config')

const { DEBUG, TIMEOUT, MAX_RENT: MR, BEDS: B } = process.env
const MAX_RENT = Number(MR)
const BEDS = Number(B)

module.exports = async () => Promise.all([scrapeListUIs(), scrapeUrbanEdge()])

const scrapeListUIs = async () => {
  const listings = _.flatten(await Promise.all(listUIConfig.map(scrapeListUI)))
  await saveListings(listings)
  return listings
}

const scrapeUrbanEdge = async () => {
  const res = await request
    .post('https://urbanedge.apartments/search/query?page=1')
    .accept('json')
    .send({
      sort: {
        display: 'Recently Updated',
        field: 'listing.updated_at',
        dir: 'DESC'
      },
      query: {
        terms: ['prospectheightsbrooklynny'],
        ranges: { rent: { min: 500, max: MAX_RENT } },
        rooms: { beds: BEDS, baths: 0 }
      }
    })
  const listings = res.body.data.map(item => {
    const buildingSlug = item.unit.building.full_slug
    return {
      href: `https://urbanedge.apartments/${buildingSlug}/${item.id}/`,
      thumbnail: (item.images[0] && item.images[0].url) || null,
      rent: accounting.unformat(item.rent),
      noFee: true
    }
  })
  await saveListings(listings)
  return listings
}

const scrapeListUI = async ({
  url,
  liSelector,
  link,
  thumbnail,
  rent,
  noFee
}) => {
  console.log(`Scraping ${parseURL(url).host}...`)
  try {
    const html = await Nightmare({
      show: !!DEBUG.match('nightmare'),
      waitTimeout: Number(TIMEOUT),
      evalutateTimeout: Number(TIMEOUT),
      gotoTimeout: Number(TIMEOUT),
      loadTimeout: Number(TIMEOUT)
    })
      .goto(url)
      .wait(liSelector)
      .evaluate(() => document.body.innerHTML)
      .end()
    const $ = cheerio.load(html)
    const fullUrl = u => {
      if (!u) return null
      const baseURL = _.trim(u).match(/^\/\//) ? `http:${_.trim(u)}` : _.trim(u)
      const { protocol, host, path } = _.extend(
        {},
        _.pickBy(parseURL(url), _.identity),
        _.pickBy(parseURL(baseURL), _.identity)
      )
      return `${protocol}//${host}${path}`
    }
    const listings = _.compact(
      $(liSelector)
        .map((i, el) => {
          const thumbnailSrc = fullUrl(
            thumbnail($(el)).length
              ? thumbnail($(el)).get(0).tagName === 'img'
                  ? thumbnail($(el)).attr('src')
                  : thumbnail($(el)).css('background-image')
                      ? thumbnail($(el))
                          .css('background-image')
                          .replace('url(', '')
                          .replace(/\)$/, '')
                          .replace(/^"/, '')
                          .replace(/"$/, '')
                      : null
              : null
          )
          const $link = link($(el)).first()
          const $rent = rent($(el)).first()
          return {
            href: fullUrl($link.attr && $link.attr('href')),
            thumbnail: thumbnailSrc,
            rent: accounting.unformat($rent.text()),
            noFee: !!noFee($(el))
          }
        })
        .get()
    )
    console.log(
      `Finished scraping ${listings.length} from ${parseURL(url).host}...`
    )
    return listings
  } catch (err) {
    console.error(`Failed to scrape ${parseURL(url).host.replace('www.', '')}`)
    console.error(err)
    return []
  }
}

const saveListings = listings =>
  Promise.all(
    listings.map(async listing => {
      const listings = await db.listings()
      await listings.update(
        { href: listing.href },
        { $set: listing, $setOnInsert: { scrapedOn: new Date() } },
        { upsert: true }
      )
    })
  )
