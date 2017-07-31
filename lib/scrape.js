const Nightmare = require('nightmare')
const accounting = require('accounting')
const cheerio = require('cheerio')
const _ = require('lodash')
const { parse: parseURL } = require('url')
const db = require('./db')

const { DEBUG, TIMEOUT } = process.env

module.exports = async websiteConfig => {
  const listings = _.flatten(await Promise.all(websiteConfig.map(scrape)))
  await Promise.all(
    listings.map(listing =>
      db.listings.update(
        { href: listing.href },
        {
          $set: listing,
          $setOnInsert: { scrapedOn: new Date() }
        },
        { upsert: true }
      )
    )
  )
  return listings
}

const scrape = async ({ url, liSelector, link, thumbnail, rent, noFee }) => {
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
