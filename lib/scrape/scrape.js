const request = require('superagent')
const Nightmare = require('nightmare')
const accounting = require('accounting')
const cheerio = require('cheerio')
const _ = require('lodash')
const { parse: parseURL } = require('url')
const db = require('../db')
const listUIConfig = require('./list-ui-config')
const chalk = require('chalk')

const { TIMEOUT, MAX_RENT: MR, BEDS: B, TARGET_SCRAPERS } = process.env
const MAX_RENT = Number(MR)
const BEDS = Number(B)
const yellow = msg => console.log(chalk.yellow(msg))
const green = msg => console.log(chalk.green(msg))
const red = msg => console.error(chalk.red(msg))

module.exports = async () => Promise.all([scrapeListUIs(), scrapeUrbanEdge()])

const scrapeListUIs = async () => {
  const listConfig = listUIConfig.filter(item =>
    item.url.match(TARGET_SCRAPERS)
  )
  _.flatten(await Promise.all(listConfig.map(scrapeListUI)))
}

const scrapeUrbanEdge = async () => {
  yellow(`Scraping urbanedge...`)
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
  yellow(`Scraping ${host(url)}...`)
  try {
    const html = await Nightmare({
      show: true,
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
    const listings = _.compact(
      $(liSelector)
        .map((i, el) => {
          const thumbnailSrc = fullUrl(
            url,
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
            href: fullUrl(url, $link.attr && $link.attr('href')),
            thumbnail: thumbnailSrc,
            rent: accounting.unformat($rent.text()),
            noFee: !!noFee($(el))
          }
        })
        .get()
    )
    await saveListings(listings)
    return listings
  } catch (err) {
    red(`Failed to scrape ${host(url)}`)
    red(err)
    return []
  }
}

const saveListings = async listings => {
  await Promise.all(
    listings.map(async listing => {
      const listings = await db.listings()
      await listings.update(
        { href: listing.href },
        { $set: listing, $setOnInsert: { scrapedOn: new Date() } },
        { upsert: true }
      )
    })
  )
  green(`Saved ${listings.length} listings from ${host(listings[0].href)}...`)
}

const host = url => parseURL(url).host.replace('www.', '')

const fullUrl = (base = '', u = '') => {
  if (!u) return null
  const baseURL = _.trim(u).match(/^\/\//) ? `http:${_.trim(u)}` : _.trim(u)
  const { protocol, host, path } = _.extend(
    {},
    _.pickBy(parseURL(base), _.identity),
    _.pickBy(parseURL(baseURL), _.identity)
  )
  return `${protocol}//${host}${path}`
}
