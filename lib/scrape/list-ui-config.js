const moment = require('moment')
const { BEDS, MAX_RENT } = process.env

module.exports = [
  {
    url: `https://nooklyn.com/rentals?_=1536546175&q=eyJhZGRyZXNzIjpudWxsLCJhZ2VudF9pZF9saXN0IjpudWxsLCJhbWVuaXR5X2xpc3QiOiIiLCJhcGFydG1lbnQiOm51bGwsImRhdGVfYXZhaWxhYmxlIjpudWxsLCJtaW5fYmF0aHMiOjAsImJlZF9saXN0IjoiMSIsImJvdHRvbV9yaWdodF9saXN0IjoiNDAuNjQzNDQzMjc1MTY5NzUsLTczLjk0NzI2NDk0OTczNzUzIiwiZXhjbHVzaXZlIjpmYWxzZSwiZmVhdHVyZWQiOmZhbHNlLCJsaXN0aW5nX2lkIjpudWxsLCJtYXhfcHJpY2UiOjMwMDAsIm1pbl9wcmljZSI6MjAwMCwibWluX3ByaWNlX3Blcl9iZWQiOm51bGwsIm1heF9wcmljZV9wZXJfYmVkIjpudWxsLCJsYXRpdHVkZSI6bnVsbCwibG9uZ2l0dWRlIjpudWxsLCJuZWlnaGJvcmhvb2RfaWRfbGlzdCI6IjEwLDgiLCJub19mZWUiOmZhbHNlLCJvcmRlciI6InJlY2VudGx5X2NyZWF0ZWQiLCJvd25lcl9wYXlzIjpmYWxzZSwicGV0cyI6IkFueSIsIm1pbl9zcXVhcmVfZmVldCI6bnVsbCwibWF4X3NxdWFyZV9mZWV0IjpudWxsLCJzdGF0dXNfbGlzdCI6IkF2YWlsYWJsZSIsInN1YndheV9pZF9saXN0IjoiIiwidG9wX2xlZnRfbGlzdCI6IjQwLjcxOTQ2NzU2ODU1NjMyNSwtNzQuMDA1MjQzNTc5ODAzNDUiLCJ0eXBlIjoicmVzaWRlbnRpYWwiLCJ0cmFuc2FjdGlvbiI6InJlbnRhbHMiLCJyZWdpb25faWRfbGlzdCI6IiIsInZhY2FudCI6ZmFsc2V9`,
    liSelector: '.nklyn-listing',
    link: $li => $li.find('a'),
    thumbnail: $li => $li.find('img'),
    rent: $li => $li.find('.nooklyn_listing_square_price'),
    noFee: $li => $li.find('.nooklyn_listing_square_fee').length
  },
  {
    url: `https://www.compass.com/search/rentals/nyc/boerum-hill/?bedrooms=${BEDS}&neighborhoods=Carroll%20Gardens&neighborhoods=Cobble%20Hill&neighborhoods=Downtown%20Brooklyn&neighborhoods=Fort%20Greene&neighborhoods=Prospect%20Heights&max_price=${3000}`,
    liSelector: 'uc-listing-card',
    link: $li => $li.find('.uc-listingCard-titleWrapper'),
    thumbnail: $li => $li.find('.uc-listingCard-image').attr('data-bg'),
    rent: $li => $li.find('[data-tn="listingCard-label-price"]'),
    noFee: $li => $li.find('.uc-listingCard-cornerBox').text().match(/no fee/i)
  },
  {
    url: `https://streeteasy.com/for-rent/nyc/price:-${MAX_RENT}%7Carea:306,321,322,303,304,326,302%7Cbeds:${BEDS}`,
    liSelector: '#result-details .item:not(.featured)',
    link: $li => $li.find('a[href*="/building"]'),
    thumbnail: $li => $li.find('.photo img'),
    rent: $li => $li.find('.price'),
    noFee: $li => $li.find('.no_fee').length
  },
  {
    url: `https://myspacenyc.com/rentals-advanced-search/?rnhood%5B%5D=boerum+hill&rnhood%5B%5D=brooklyn+heights&rnhood%5B%5D=carroll+gardens&rnhood%5B%5D=downtown+brooklyn&rnhood%5B%5D=prospect+heights&rnhood%5B%5D=williamsburg&zipcode=&beds%5B%5D=${BEDS}&min_price=&max_price=${3000}&adv-rental_search=Search`,
    liSelector: '.listing ',
    link: $li => $li.find('a'),
    thumbnail: $li => $li.find('img'),
    rent: $li => $li.find('.price'),
    noFee: $li => false
  },
  {
    url: `https://www.nakedapartments.com/renter/listings/search?bldid=&nids=36%2C30%2C37%2C38%2C32%2C34%2C28&aids=4&min_rent=&max_rent=${MAX_RENT}&amids=&pets=&baths=&oh=&subl=&button=`,
    liSelector: '.listing-row',
    link: $li => $li.find('.listing-row__image-link'),
    thumbnail: $li =>
      $li.find('.listing-row__image-container img').attr('data-original'),
    rent: $li => $li.find('.listing-row__rent'),
    noFee: $li => $li.find('.offer').text().match(/no fee/i)
  },
  {
    url: `https://www.zumper.com/apartments-for-rent/new-york-ny/${BEDS}-beds/under-${MAX_RENT}?box=-74.0063023915,40.6669589166,-73.9517140736,40.703406887`,
    liSelector: '.listingFeed [ng-repeat*=item]',
    link: $li => $li.find('[ng-href*="/apartments-for-rent"]'),
    thumbnail: $li => $li.find('.feedItem-imgBox img'),
    rent: $li => $li.find('[ng-bind="::item.priceText"]'),
    noFee: $li => $li.find('.feedItem-status').text().match(/no broker fee/i)
  },
  {
    url: `https://www.renthop.com/search/nyc?min_price=0&max_price=${3000}&bedrooms%5B%5D=${BEDS}&q=&neighborhoods_str=41%2C72%2C86%2C99%2C14&sort=hopscore&page=1&search=1`,
    liSelector: '.search-listing',
    link: $li => $li.find('.listing-title-link'),
    thumbnail: $li => $li.find('.search-thumbs img'),
    rent: $li => $li.find('.listing-13170731-info'),
    noFee: $li => $li.find('.listing-search-info').text().match(/no fee/i)
  },
  {
    url: `https://www.triplemint.com/listings?listing_type=rental&bedrooms=${BEDS}&neighborhood=305&neighborhood=321&neighborhood=322&neighborhood=303&neighborhood=326&neighborhood=302&neighborhood=306&neighborhood=304&max_price=${MAX_RENT}`,
    liSelector: '.listing-card',
    link: $li => null,
    thumbnail: $li => $li.find('.thumbnail'),
    rent: $li => $li.find('[class*=-price]'),
    noFee: $li => false
  },
  ...[
    'boerum+hill',
    'cobble+hill',
    'prospect+heights',
    'brooklyn+heights',
    'fort-greene',
    'williamsburg'
  ].map(neighborhood => ({
    url: `https://newyork.craigslist.org/search/abo?query=%22${neighborhood}%22&nearbyArea=349&nearbyArea=249&nearbyArea=561&nearbyArea=250&nearbyArea=168&nearbyArea=170&max_price=${MAX_RENT}&availabilityMode=0&sale_date=all+dates`,
    liSelector: '.result-row',
    link: $li => $li.find('> a'),
    thumbnail: $li => $li.find('img'),
    rent: $li => $li.find('.result-price'),
    noFee: $li => true
  })),
  ...[
    'prospect_heights',
    'boerum_hill',
    'carroll_gardens',
    'clinton_hill',
    'cobble_hill',
    'downtown_brooklyn',
    'fort_greene'
  ].map(neighborhood => ({
    url: `https://www.nybits.com/search/?_a%21process=y&_rid_=5&_ust_todo_=65733&_xid_=lb..I_O3aR5Fr0-1501456916&%21%21atypes=${BEDS}br&%21%21rmin=&%21%21rmax=${MAX_RENT}&%21%21fee=nofee&%21%21orderby=dateposted&%21%21nsearch=${neighborhood}&submit=+SHOW+RENTAL+APARTMENTS+`,
    liSelector: '#rentaltable tr:nth-of-type(2n + 2)',
    link: $li => $li.find('a'),
    thumbnail: $li => $li,
    rent: $li => $li.find('.lst_sr_price'),
    noFee: $li => true
  })),
  {
    url: `https://www.trulia.com/for_rent/40.663502064975,40.718819911538,-74.005811744452,-73.947833114386_xy/${BEDS}p_beds/0-${MAX_RENT}_price/beds;d_sort/`,
    liSelector: '.card',
    link: $li => $li.find('a'),
    thumbnail: $li => $li.find('.cardPhoto'),
    rent: $li => $li.find('.cardPrice'),
    noFee: $li => false
  },
  {
    url: `https://joinery.nyc/search?utf8=%E2%9C%93&neighborhoods%5B%5D=57&neighborhoods%5B%5D=28&neighborhoods%5B%5D=203&neighborhoods%5B%5D=265&neighborhoods%5B%5D=42&bedrooms=${BEDS}&listing-type=1&date=&price-low=Min+%24&price-high=${MAX_RENT}`,
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
    url: `https://flip.lease/s?availableBy=1506830400000&bedrooms=${BEDS}&listingType=entire_place&maxLat=40.72362118934237&maxLng=-73.94065115715536&maxLong=-73.94648551940917&maxPrice=${MAX_RENT}&minDuration=6&minLat=40.65942149383429&minLng=-74.00362413300691&minLong=-73.98734092712402&page=1&propertyType=residential&zoom=14`,
    liSelector: 'a[href*="/listing"]',
    link: $li => $li,
    thumbnail: $li => $li.parent(),
    rent: $li => $li.find('> div:first-child > div:nth-child(2) > div'),
    noFee: $li => true
  },
  {
    url: `https://padspin.com/listings?neighborhoods=41&neighborhoods=20&neighborhoods=57&neighborhoods=108&neighborhoods=13&neighborhoods=39&neighborhoods=45&neighborhoods=7&bedrooms=${BEDS}&max_rent=${MAX_RENT}&earliest_move_date=10-01-2018`,
    liSelector: '.link.card',
    link: $li => $li,
    thumbnail: $li => $li.find('.image'),
    rent: $li => $li.find('.content > p:first-child'),
    noFee: $li => true
  }
]
