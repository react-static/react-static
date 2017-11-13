/* eslint-disable */
var path = require('path')

// require.resolve has to be used for the presets and plugins,
// or Babel will look for them relative to the user's folder
function r(name) {
  return require.resolve(name)
}

module.exports = function() {
  var plugins = [
    [r('@babel/plugin-transform-runtime'), {
      helpers: false,
      polyfill: false,
      regenerator: true,
      // require.resolve can't be used here since @babel/runtime has no index
      moduleName: path.resolve(__dirname, 'node_modules/@babel/runtime')
    }]
  ]

  if (process.env.NODE_ENV === 'development') {
    plugins.unshift(r('react-hot-loader/babel'))
  }

  return {
    presets: [
      [r('@babel/preset-env'), {
        loose: true,
        modules: false
      }],
      r('@babel/preset-stage-0'),
      r('@babel/preset-react')
    ],
    plugins: plugins
  }
}
