const EventEmitter = require('events')
const _ = require('lodash')

const state = (module.exports = new EventEmitter())

state.data = {
  listings: [],
  index: 0
}

state.set = newState => state.emit('update', _.assign(state.data, newState))

state.get = attr => (attr ? state.data[attr] : state.data)
