'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _inquirerAutocompletePrompt = require('inquirer-autocomplete-prompt');

var _inquirerAutocompletePrompt2 = _interopRequireDefault(_inquirerAutocompletePrompt);

var _matchSorter = require('match-sorter');

var _matchSorter2 = _interopRequireDefault(_matchSorter);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_inquirer2.default.registerPrompt('autocomplete', _inquirerAutocompletePrompt2.default);

var _default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var files, exampleList, answers, dest, isYarn;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _fsExtra2.default.readdir(_path2.default.resolve(__dirname, '../../examples/'));

          case 2:
            files = _context2.sent;


            console.log('');

            exampleList = files.filter(function (d) {
              return !d.startsWith('.');
            });

            exampleList = ['basic'].concat(_toConsumableArray(exampleList.filter(function (d) {
              return d !== 'basic';
            })));

            _context2.next = 8;
            return _inquirer2.default.prompt([{
              type: 'input',
              name: 'name',
              message: 'What should we name this project?',
              default: 'my-static-site'
            }, {
              type: 'autocomplete',
              name: 'template',
              message: 'Select a template below...',
              source: function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(answersSoFar, input) {
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          return _context.abrupt('return', !input ? exampleList : (0, _matchSorter2.default)(exampleList, input));

                        case 1:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined);
                }));

                return function source(_x, _x2) {
                  return _ref2.apply(this, arguments);
                };
              }()
            }]);

          case 8:
            answers = _context2.sent;


            console.time(_chalk2.default.green('=> [\u2713] Project "' + answers.name + '" created'));
            console.log('=> Creating new react-static project...');
            dest = _path2.default.resolve(process.cwd(), answers.name);
            _context2.next = 14;
            return _fsExtra2.default.copy(_path2.default.resolve(__dirname, '../../examples/' + answers.template), dest);

          case 14:

            // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
            // See: https://github.com/npm/npm/issues/1862
            _fsExtra2.default.move(_path2.default.join(dest, 'gitignore'), _path2.default.join(dest, '.gitignore'), [], function (err) {
              if (err) {
                // Append if there's already a `.gitignore` file there
                if (err.code === 'EEXIST') {
                  var data = _fsExtra2.default.readFileSync(_path2.default.join(dest, 'gitignore'));
                  _fsExtra2.default.appendFileSync(_path2.default.join(dest, '.gitignore'), data);
                  _fsExtra2.default.unlinkSync(_path2.default.join(dest, 'gitignore'));
                } else {
                  throw err;
                }
              }
            });

            isYarn = shouldUseYarn();


            console.log('=> Installing dependencies with: ' + (isYarn ? _chalk2.default.hex(_utils.ChalkColor.yarn)('Yarn') : _chalk2.default.hex(_utils.ChalkColor.npm)('NPM')) + '...');
            // We install react-static separately to ensure we always have the latest stable release
            (0, _child_process.execSync)('cd ' + answers.name + ' && ' + (isYarn ? 'yarn' : 'npm install') + ' && ' + (isYarn ? 'yarn add react-static@latest' : 'npm install react-static@latest --save'));
            console.log('');
            console.timeEnd(_chalk2.default.green('=> [\u2713] Project "' + answers.name + '" created'));

            console.log('\n' + _chalk2.default.green('=> To get started:') + '\n\n    cd ' + answers.name + '\n\n    ' + (isYarn ? _chalk2.default.hex(_utils.ChalkColor.yarn)('yarn') : _chalk2.default.hex(_utils.ChalkColor.npm)('npm run')) + ' start ' + _chalk2.default.green('- Start the development server') + '\n    ' + (isYarn ? _chalk2.default.hex(_utils.ChalkColor.yarn)('yarn') : _chalk2.default.hex(_utils.ChalkColor.npm)('npm run')) + ' build ' + _chalk2.default.green('- Build for production') + '\n    ' + (isYarn ? _chalk2.default.hex(_utils.ChalkColor.yarn)('yarn') : _chalk2.default.hex(_utils.ChalkColor.npm)('npm run')) + ' serve ' + _chalk2.default.green('- Test a production build locally') + '\n  ');

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function _default() {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;


function shouldUseYarn() {
  try {
    (0, _child_process.execSync)('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(shouldUseYarn, 'shouldUseYarn', 'src/commands/create.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/commands/create.js');
}();

;