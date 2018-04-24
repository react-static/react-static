'use strict';

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var updateNotifier = require('update-notifier');
var pkg = require('../../package.json');

updateNotifier({ pkg: pkg }).notify({
  isGlobal: false
});

// necesarry at any entry point of the cli to ensure that Babel-register
// does not attempt to transform non JavaScript files.
var ignoredExtensions = ['css', 'scss', 'styl', 'less', 'png', 'gif', 'jpg', 'jpeg', 'svg', 'woff', 'woff2', 'ttf', 'eot', 'otf', 'mp4', 'webm', 'ogg', 'mp3', 'wav', 'md', 'yaml'];
ignoredExtensions.forEach(function (ext) {
  require.extensions['.' + ext] = function () {};
});

// Be sure to log useful information about unhandled exceptions. This should seriously
// be a default: https://github.com/nodejs/node/issues/9523#issuecomment-259303079
process.on('unhandledRejection', function (r) {
  console.log('');
  console.log('UnhandledPromiseRejectionWarning: Unhandled Promise Rejection');
  console.log(r);
});
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(ignoredExtensions, 'ignoredExtensions', 'src/utils/binHelper.js');
  leaveModule(module);
})();

;