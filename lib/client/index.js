const yo = require('yo-yo')
const root = require('./root')
const state = require('./state')
const _ = require('lodash')
const moment = require('moment')
const { adjustedRent } = require('./model')

const el = document.getElementById('main')
const render = () => yo.update(el, root())
const listings = _.sortBy(
  window.BOOTSTRAP,
  l => -moment(l.scrapedOn).diff(moment(), 'minutes') + adjustedRent(l) / 10000
)

document.onkeydown = e => {
  const i = state.get('index')
  if (e.which === 39 && i < state.get('listings').length) {
    state.set({ index: i + 1 })
  } else if (e.which === 37 && i > 0) {
    state.set({ index: i - 1 })
  }
}

state.on('update', render)
state.set({ listings })
