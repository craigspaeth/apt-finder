const yo = require('yo-yo')
const root = require('./root')
const state = require('./state')

const el = document.getElementById('main')
const render = () => yo.update(el, root())

document.onkeydown = e => {
  const i = state.get('index')
  if (e.which === 39 && i < state.get('listings').length) {
    state.set({ index: i + 1 })
  } else if (e.which === 37 && i > 0) {
    state.set({ index: i - 1 })
  }
}

state.on('update', render)
state.set({ listings: window.BOOTSTRAP })
