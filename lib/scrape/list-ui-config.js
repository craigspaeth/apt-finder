const moment = require('moment')
const { BEDS, MAX_RENT } = process.env
const { szlugify } = require('lodash')

module.exports = [
  {
    url: `https://nooklyn.com/rentals?_=1503951639&q=eyJhZGRyZXNzIjpudWxsLCJhZ2VudF9pZF9saXN0IjpudWxsLCJhbWVuaXR5X2xpc3QiOm51bGwsImFwYXJ0bWVudCI6bnVsbCwiZGF0ZV9hdmFpbGFibGUiOm51bGwsIm1pbl9iYXRocyI6bnVsbCwiYmVkX2xpc3QiOiIyIiwiYm90dG9tX3JpZ2h0X2xpc3QiOiIiLCJleGNsdXNpdmUiOmZhbHNlLCJmZWF0dXJlZCI6ZmFsc2UsImxpc3RpbmdfaWQiOm51bGwsIm1heF9wcmljZSI6MzAwMCwibWluX3ByaWNlIjpudWxsLCJtaW5fcHJpY2VfcGVyX2JlZCI6bnVsbCwibWF4X3ByaWNlX3Blcl9iZWQiOm51bGwsImxhdGl0dWRlIjpudWxsLCJsb25naXR1ZGUiOm51bGwsIm5laWdoYm9yaG9vZF9pZF9saXN0IjoiMTAsOCIsIm5vX2ZlZSI6ZmFsc2UsIm9yZGVyIjoicmVjZW50bHlfY3JlYXRlZCIsIm93bmVyX3BheXMiOmZhbHNlLCJwZXRzIjoiQW55IiwibWluX3NxdWFyZV9mZWV0IjpudWxsLCJtYXhfc3F1YXJlX2ZlZXQiOm51bGwsInN0YXR1c19saXN0IjoiQXZhaWxhYmxlIiwic3Vid2F5X2lkX2xpc3QiOiIiLCJ0b3BfbGVmdF9saXN0IjoiIiwidHlwZSI6InJlc2lkZW50aWFsIiwidHJhbnNhY3Rpb24iOiJyZW50YWxzIiwicmVnaW9uX2lkX2xpc3QiOiIiLCJ2YWNhbnQiOmZhbHNlfQ%3D%3D`,
    liSelector: '.nklyn-listing',
    link: $li => $li.find('a'),
    thumbnail: $li => $li.find('img'),
    rent: $li => $li.find('.nooklyn_listing_square_price'),
    noFee: $li => $li.find('.nooklyn_listing_square_fee').length
  },
  {
    url: `https://www.compass.com/search/nyc/?start=0&order=5&&neighborhoods=Crown%20Heights&neighborhoods=Prospect&listingTypes=0&max_price=${MAX_RENT}&bedrooms=${BEDS}&lat=40.67785029297782&lng=-73.96994999999998&zoom=15`,
    liSelector: 'uc-listing-card',
    link: $li => $li.find('.uc-listingCard-titleWrapper'),
    thumbnail: $li => $li.find('.uc-listingCard-image').attr('data-bg'),
    rent: $li => $li.find('[data-tn="listingCard-label-price"]'),
    noFee: $li => $li.find('.uc-listingCard-cornerBox').text().match(/no fee/i)
  },
  {
    url: `http://streeteasy.com/for-rent/nyc/price:-${MAX_RENT}%7Carea:325,326%7Cbeds:${BEDS}`,
    liSelector: '#result-details .item:not(.featured)',
    link: $li => $li.find('a[href*="/building"]'),
    thumbnail: $li => $li.find('.photo img'),
    rent: $li => $li.find('.price'),
    noFee: $li => $li.find('.no_fee').length
  },
  {
    url: `http://www.myspace-nyc.com/?layout=${BEDS}br&max_price=${MAX_RENT}&neighborhoods=166&neighborhoods=157&page=1&sort=updated&view=map`,
    liSelector: '.listing ',
    link: $li => $li.find('a'),
    thumbnail: $li => $li.find('img'),
    rent: $li => $li.find('.price'),
    noFee: $li => false
  },
  {
    url: `https://www.nakedapartments.com/renter/listings/search?bldid=&nids=45%2C28&aids=4&min_rent=&max_rent=3000&amids=&pets=&baths=&oh=&subl=`,
    liSelector: '.listing-row',
    link: $li => $li.find('.listing-row__image-link'),
    thumbnail: $li =>
      $li.find('.listing-row__image-container img').attr('data-original'),
    rent: $li => $li.find('.listing-row__rent'),
    noFee: $li => $li.find('.offer').text().match(/no fee/i)
  },
  {
    url: `https://www.zumper.com/apartments-for-rent/new-york-ny/prospect-heights/${BEDS}-beds/under-${MAX_RENT}?box=-73.9698483386,40.666342577,-73.9425541796,40.6845692222`,
    liSelector: '.listingFeed [ng-repeat*=item]',
    link: $li => $li.find('[ng-href*="/apartments-for-rent"]'),
    thumbnail: $li => $li.find('.feedItem-imgBox img'),
    rent: $li => $li.find('[ng-bind="::item.priceText"]'),
    noFee: $li => $li.find('.feedItem-status').text().match(/no broker fee/i)
  },
  {
    url: `https://www.renthop.com/search/nyc?location_search=&bedrooms%5B%5D=${BEDS}&min_price=0&max_price=${MAX_RENT}&q=&neighborhoods_str=52%2C78&sort=hopscore&page=1&search=1`,
    liSelector: '#search-results-box > .search-listing',
    link: $li => $li.find('a[href*="listings"]'),
    thumbnail: $li => $li.find('.search-photo-first img'),
    rent: $li => $li.find('[id*="price"]'),
    noFee: $li => $li.find('.listing-search-info').text().match(/no fee/i)
  },
  {
    url: `https://www.triplemint.com/listings?listing_type=rental&max_price=${MAX_RENT}&neighborhood=78&neighborhood=85&bedrooms=${BEDS}`,
    liSelector: '.listing-card',
    link: $li => null,
    thumbnail: $li => $li.find('.thumbnail'),
    rent: $li => $li.find('.price'),
    noFee: $li => false
  },
  {
    url: `https://newyork.craigslist.org/search/abo?query="prospect+heights"+or+"crown+heights"&max_price=${MAX_RENT}&min_bedrooms=${BEDS}&max_bedrooms=${BEDS}&availabilityMode=0`,
    liSelector: '.result-row',
    link: $li => $li.find('> a'),
    thumbnail: $li => $li.find('img'),
    rent: $li => $li.find('.result-price'),
    noFee: $li => true
  },
  {
    url: `https://www.nybits.com/search/?_a%21process=y&_rid_=5&_ust_todo_=65733&_xid_=lb..I_O3aR5Fr0-1501456916&%21%21atypes=${BEDS}br&%21%21rmin=&%21%21rmax=${MAX_RENT}&%21%21fee=nofee&%21%21orderby=dateposted&%21%21nsearch=prospect_heights&submit=+SHOW+RENTAL+APARTMENTS+`,
    liSelector: '#rentaltable tr:nth-of-type(2n + 2)',
    link: $li => $li.find('a'),
    thumbnail: $li => $li,
    rent: $li => $li.find('.lst_sr_price'),
    noFee: $li => true
  },
  {
    url: `https://www.nybits.com/search/?_a%21process=y&_rid_=5&_ust_todo_=65733&_xid_=lb..I_O3aR5Fr0-1501456916&%21%21atypes=${BEDS}br&%21%21rmin=&%21%21rmax=${MAX_RENT}&%21%21fee=nofee&%21%21orderby=dateposted&%21%21nsearch=crown_heights&submit=+SHOW+RENTAL+APARTMENTS+`,
    liSelector: '#rentaltable tr:nth-of-type(2n + 2)',
    link: $li => $li.find('a'),
    thumbnail: $li => $li,
    rent: $li => $li.find('.lst_sr_price'),
    noFee: $li => true
  },
  {
    url: `https://www.trulia.com/for_rent/40.662769363931,40.68949065725,-73.974436787737,-73.936113385332_xy/${BEDS}p_beds/0-${MAX_RENT}_price/beds;d_sort/`,
    liSelector: '.card',
    link: $li => $li.find('a'),
    thumbnail: $li => $li.find('.cardPhoto'),
    rent: $li => $li.find('.cardPrice'),
    noFee: $li => false
  },
  {
    url: `https://joinery.nyc/search?utf8=%E2%9C%93&neighborhoods%5B%5D=203&neighborhoods%5B%5D=67&neighborhoods%5B%5D=21&bedrooms=2&listing-type=1&date=&price-low=Min+%24&price-high=3000`,
    liSelector: '.listing-col',
    link: $li => $li.find('a.item'),
    thumbnail: $li => $li.find('a.item'),
    rent: $li => $li.find('.price'),
    noFee: $li => true
  },
  {
    url: `https://www.listingsproject.com/newsletter/${moment()
      .day(3)
      .format('YYYY-MM-DD')}/new-york-city/apt_rent`,
    liSelector: '.search-listings-section > div> .row:nth-of-type(1)',
    link: $li => $li.find('.search-listing__a-wrapper'),
    thumbnail: $li => $li.find('img').attr('data-src'),
    rent: $li => $li.find('.search-listing-price'),
    noFee: $li => true
  },
  {
    url: `https://www.listingsproject.com/newsletter/${moment()
      .day(3)
      .format('YYYY-MM-DD')}/new-york-city/lease_takeover`,
    liSelector: '.search-listings-section > div> .row:nth-of-type(1)',
    link: $li => $li.find('.search-listing__a-wrapper'),
    thumbnail: $li => $li.find('img').attr('data-src'),
    rent: $li => $li.find('.search-listing-price'),
    noFee: $li => true
  },
  {
    url: `https://flip.lease/s?page=1&propertyType=residential&maxPrice=${MAX_RENT}&listingType=entire_place&maxLat=40.70061769132372&maxLong=-73.94648551940917&minLat=40.654987591810205&minLong=-73.98734092712402&zoom=14&availableBy=1506830400000&bedrooms=${BEDS}&minDuration=6`,
    liSelector: 'a[href*="/listing"]',
    link: $li => $li,
    thumbnail: $li => $li.parent(),
    rent: $li => $li.find('> div:first-child > div:nth-child(2) > div'),
    noFee: $li => true
  },
  {
    url: `https://padspin.com/listings?neighborhoods=Prospect+Heights&neighborhoods=Clinton+Hill&neighborhoods=Crown+Heights&neighborhoods=Downtown+Brooklyn&neighborhoods=Park+Slope&bedrooms=${BEDS}&move_in_date=&maxrent=${MAX_RENT}`,
    liSelector: '.link.card',
    link: $li => $li,
    thumbnail: $li => $li.find('.image'),
    rent: $li => $li.find('.content > p:first-child'),
    noFee: $li => true
  }
]
