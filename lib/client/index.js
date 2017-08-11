const yo = require('yo-yo')
const root = require('./root')
const state = require('./state')

const el = document.getElementById('main')
const render = () => yo.update(el, root())
state.on('update', render)
state.set({ listings: window.BOOTSTRAP })
