const preact = require('preact-compat')

const react = {}
// Copy object properties to a new object which will allow react-hot-loader to do its magic
Object.keys(preact).forEach(key => {
  react[key] = preact[key]
})

module.exports = react
