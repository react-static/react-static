'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-register');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ignoredExtensions = ['css', 'scss', 'styl', 'less', 'png', 'gif', 'jpg', 'jpeg', 'svg', 'woff', 'ttf', 'eot', 'otf', 'mp4', 'webm', 'ogg', 'mp3', 'wav', 'md', 'yaml'];
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

var _default = function _default() {
  var cmd = process.argv[2];
  var cliArguments = process.argv.slice(3);

  if (['-v', '--version'].indexOf(cmd) !== -1) {
    var packageJson = JSON.parse(_fs2.default.readFileSync(__dirname + '/../../package.json', 'utf8'));
    return console.log(packageJson.version);
  }

  if (cmd === 'start') {
    if (typeof process.env.NODE_ENV === 'undefined') {
      process.env.NODE_ENV = 'development';
    }
    process.env.REACT_STATIC_ENV = 'development';
    return require('./start').default(cliArguments);
  }

  if (cmd === 'build') {
    if (typeof process.env.NODE_ENV === 'undefined') {
      process.env.NODE_ENV = 'production';
    }
    process.env.REACT_STATIC_ENV = 'production';
    return require('./build').default(cliArguments);
  }

  if (cmd === 'create') {
    return require('./create').default(process.argv[3]);
  }

  console.log('\nUsage: react-static <command>\n\n- ' + _chalk2.default.green('create') + '  -  create a new project\n- ' + _chalk2.default.green('start') + '  -  start the development server\n- ' + _chalk2.default.green('build') + '  -  build site for production\n\nOptions:\n\n    -v, --version output the version number\n');
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ignoredExtensions, 'ignoredExtensions', 'src/commands/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/commands/index.js');
}();

;