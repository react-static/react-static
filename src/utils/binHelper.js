const updateNotifier = require('update-notifier')
const pkg = require('../../package.json')

updateNotifier({ pkg }).notify({
  isGlobal: false,
})

// necesarry at any entry point of the cli to ensure that Babel-register
// does not attempt to transform non JavaScript files.
const ignoredExtensions = [
  'css',
  'scss',
  'styl',
  'less',
  'png',
  'gif',
  'jpg',
  'jpeg',
  'svg',
  'woff',
  'ttf',
  'eot',
  'otf',
  'mp4',
  'webm',
  'ogg',
  'mp3',
  'wav',
  'md',
  'yaml',
]
ignoredExtensions.forEach(ext => {
  require.extensions[`.${ext}`] = () => {}
})

// Be sure to log useful information about unhandled exceptions. This should seriously
// be a default: https://github.com/nodejs/node/issues/9523#issuecomment-259303079
process.on('unhandledRejection', r => {
  console.log('')
  console.log('UnhandledPromiseRejectionWarning: Unhandled Promise Rejection')
  console.log(r)
})
