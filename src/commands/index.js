/* eslint-disable */
require = require('@std/esm')(module, {
  esm: 'js',
  cjs: true
})
require('@babel/register')({
  babelrc: false,
  presets: [require('../../babel-preset')],
  cache: false
})

module.exports.default = require('./main').default
