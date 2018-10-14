'use strict';

var updateNotifier = require('update-notifier');
var pkg = require('../../package.json');
var PrettyError = require('pretty-error');

updateNotifier({ pkg: pkg }).notify({
  isGlobal: false
});

// necesarry at any entry point of the cli to ensure that Babel-register
// does not attempt to transform non JavaScript files.
var ignoredExtensions = ['css', 'scss', 'styl', 'less', 'png', 'gif', 'jpg', 'jpeg', 'svg', 'woff', 'woff2', 'ttf', 'eot', 'otf', 'mp4', 'webm', 'ogg', 'mp3', 'wav', 'md', 'yaml'];
ignoredExtensions.forEach(function (ext) {
  require.extensions['.' + ext] = function () {};
});

console.error = function (err) {
  var _console;

  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  return (_console = console).log.apply(_console, [new PrettyError().render(err)].concat(rest));
};

// Be sure to log useful information about unhandled exceptions. This should seriously
// be a default: https://github.com/nodejs/node/issues/9523#issuecomment-259303079
process.on('unhandledRejection', function (r) {
  console.log('');
  console.log('UnhandledPromiseRejectionWarning: Unhandled Promise Rejection');
  console.error(r);
});