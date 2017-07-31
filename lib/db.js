const pmongo = require('promised-mongo')

const { DB_URL } = process.env

module.exports = pmongo(DB_URL, ['listings'])
