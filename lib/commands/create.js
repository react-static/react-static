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

var _gitPromise = require('git-promise');

var _gitPromise2 = _interopRequireDefault(_gitPromise);

var _child_process = require('child_process');

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _inquirerAutocompletePrompt = require('inquirer-autocomplete-prompt');

var _inquirerAutocompletePrompt2 = _interopRequireDefault(_inquirerAutocompletePrompt);

var _matchSorter = require('match-sorter');

var _matchSorter2 = _interopRequireDefault(_matchSorter);

var _downloadGitRepo = require('download-git-repo');

var _downloadGitRepo2 = _interopRequireDefault(_downloadGitRepo);

var _util = require('util');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_inquirer2.default.registerPrompt('autocomplete', _inquirerAutocompletePrompt2.default);

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var _this = this;

    var fetchTemplate = function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(template, dest) {
        var getGitHubRepo;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!silent) console.log('');

                if (!(template.startsWith('https://') || template.startsWith('git@'))) {
                  _context2.next = 14;
                  break;
                }

                _context2.prev = 2;

                if (!silent) console.log(_chalk2.default.green('Downloading template: ' + template));
                _context2.next = 6;
                return (0, _gitPromise2.default)('clone --recursive ' + template + ' ' + dest);

              case 6:
                _context2.next = 12;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2['catch'](2);

                if (!silent) console.log(_chalk2.default.red('Download of ' + template + ' failed'));
                throw _context2.t0;

              case 12:
                _context2.next = 48;
                break;

              case 14:
                if (!template.startsWith('http://')) {
                  _context2.next = 28;
                  break;
                }

                // use download-git-repo to fetch remote repository
                getGitHubRepo = (0, _util.promisify)(_downloadGitRepo2.default);
                _context2.prev = 16;

                if (!silent) console.log(_chalk2.default.green('Downloading template: ' + template));
                _context2.next = 20;
                return getGitHubRepo(template, dest);

              case 20:
                _context2.next = 26;
                break;

              case 22:
                _context2.prev = 22;
                _context2.t1 = _context2['catch'](16);

                if (!silent) console.log(_chalk2.default.red('Download of ' + template + ' failed'));
                throw _context2.t1;

              case 26:
                _context2.next = 48;
                break;

              case 28:
                if (!exampleList.includes(template)) {
                  _context2.next = 38;
                  break;
                }

                _context2.prev = 29;

                if (!silent) console.log(_chalk2.default.green('Using template: ' + template));
                return _context2.abrupt('return', _fsExtra2.default.copy(_path2.default.resolve(__dirname, '../../examples/' + template), dest));

              case 34:
                _context2.prev = 34;
                _context2.t2 = _context2['catch'](29);

                if (!silent) console.log(_chalk2.default.red('Copying the template: ' + template + ' failed'));
                throw _context2.t2;

              case 38:
                _context2.prev = 38;

                if (!silent) console.log(_chalk2.default.green('Using template from directory: ' + template));
                _context2.next = 42;
                return _fsExtra2.default.copy(_path2.default.resolve(__dirname, template), dest);

              case 42:
                _context2.next = 48;
                break;

              case 44:
                _context2.prev = 44;
                _context2.t3 = _context2['catch'](38);

                if (!silent) {
                  console.log(_chalk2.default.red('Copying the template from directory: ' + template + ' failed'));
                }
                throw _context2.t3;

              case 48:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 8], [16, 22], [29, 34], [38, 44]]);
      }));

      return function fetchTemplate(_x4, _x5) {
        return _ref5.apply(this, arguments);
      };
    }();

    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        name = _ref2.name,
        template = _ref2.template,
        isCLI = _ref2.isCLI,
        _ref2$silent = _ref2.silent,
        silent = _ref2$silent === undefined ? !isCLI : _ref2$silent;

    var prompts, files, exampleList, exampleChoices, shouldPrompt, answers, dest, _ref4, githubRepoName, isYarn;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            prompts = [];
            _context3.next = 3;
            return _fsExtra2.default.readdir(_path2.default.resolve(__dirname, '../../examples/'));

          case 3:
            files = _context3.sent;


            if (!silent) console.log('');

            exampleList = files.filter(function (d) {
              return !d.startsWith('.');
            });

            exampleList = ['basic'].concat(_toConsumableArray(exampleList.filter(function (d) {
              return d !== 'basic';
            })));
            exampleChoices = [].concat(_toConsumableArray(exampleList), ['custom']);

            // prompt if --name argument is not passed from CLI
            // warning: since name will be set as a function by commander by default
            //   unless it's assigned as an argument from the CLI, we can't simply just
            //   check for it's existence. if it's not been set by the CLI, we properly
            //   set it to null for later conditional checks.

            if (typeof name !== 'string') {
              name = null;
              prompts.push({
                type: 'input',
                name: 'name',
                message: 'What should we name this project?',
                default: 'my-static-site'
              });
            }

            // prompt if --template argument is not passed from CLI
            if (!template) {
              prompts.push({
                type: 'autocomplete',
                name: 'template',
                message: 'Select a template below...',
                source: function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(answersSoFar, input) {
                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            return _context.abrupt('return', !input ? exampleChoices : (0, _matchSorter2.default)(exampleChoices, input));

                          case 1:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this);
                  }));

                  return function source(_x2, _x3) {
                    return _ref3.apply(this, arguments);
                  };
                }()
              });
            }

            shouldPrompt = isCLI && (!name || !template);

            if (!shouldPrompt) {
              _context3.next = 17;
              break;
            }

            _context3.next = 14;
            return _inquirer2.default.prompt(prompts);

          case 14:
            _context3.t0 = _context3.sent;
            _context3.next = 18;
            break;

          case 17:
            _context3.t0 = {};

          case 18:
            answers = _context3.t0;


            if (answers.name) {
              name = answers.name;
            }
            if (answers.template) {
              template = answers.template;
            }

            if (name) {
              _context3.next = 23;
              break;
            }

            throw new Error('A project name is required. Please use options.name to define one.');

          case 23:
            if (template) {
              _context3.next = 25;
              break;
            }

            throw new Error('A project template is required. Please use options.template to define one.');

          case 25:

            if (!silent) console.time(_chalk2.default.green('=> [\u2713] Project "' + name + '" created'));
            if (!silent) console.log('=> Creating new react-static project...');
            dest = _path2.default.resolve(process.cwd(), name);

            if (!(template === 'custom')) {
              _context3.next = 34;
              break;
            }

            _context3.next = 31;
            return _inquirer2.default.prompt([{
              type: 'input',
              name: 'githubRepoName',
              message: 'Specify the full address of a public git repo from GitHub, BitBucket, GitLab, etc. (https://github.com/ownerName/repoName.git)',
              default: 'basic'
            }]);

          case 31:
            _ref4 = _context3.sent;
            githubRepoName = _ref4.githubRepoName;

            template = githubRepoName;

          case 34:
            _context3.next = 36;
            return fetchTemplate(template, dest);

          case 36:
            if (_fsExtra2.default.pathExistsSync(_path2.default.join(dest, '.gitignore'))) {
              _context3.next = 39;
              break;
            }

            _context3.next = 39;
            return _fsExtra2.default.move(_path2.default.join(dest, 'gitignore'), _path2.default.join(dest, '.gitignore'));

          case 39:
            if (_fsExtra2.default.pathExistsSync(_path2.default.join(dest, 'gitignore'))) {
              _fsExtra2.default.removeSync(_path2.default.join(dest, 'gitignore'));
            }

            isYarn = shouldUseYarn();


            if (isCLI) {
              if (!silent) {
                console.log('=> Installing dependencies with: ' + (isYarn ? _chalk2.default.hex(_utils.ChalkColor.yarn)('Yarn') : _chalk2.default.hex(_utils.ChalkColor.npm)('NPM')) + '...');
              }
              // We install react-static separately to ensure we always have the latest stable release
              (0, _child_process.execSync)('cd ' + name + ' && ' + (isYarn ? 'yarn' : 'npm install') + ' && ' + (isYarn ? 'yarn add react-static@latest' : 'npm install react-static@latest --save'));
              if (!silent) console.log('');
            }

            if (!silent) console.timeEnd(_chalk2.default.green('=> [\u2713] Project "' + name + '" created'));

            if (!silent) {
              console.log('\n  ' + _chalk2.default.green('=> To get started:') + '\n\n    cd ' + name + ' ' + (!isCLI ? '&& ' + (isYarn ? _chalk2.default.hex(_utils.ChalkColor.yarn)('yarn') : _chalk2.default.hex(_utils.ChalkColor.npm)('npm install')) : '') + '\n\n    ' + (isYarn ? _chalk2.default.hex(_utils.ChalkColor.yarn)('yarn') : _chalk2.default.hex(_utils.ChalkColor.npm)('npm run')) + ' start ' + _chalk2.default.green('- Start the development server') + '\n    ' + (isYarn ? _chalk2.default.hex(_utils.ChalkColor.yarn)('yarn') : _chalk2.default.hex(_utils.ChalkColor.npm)('npm run')) + ' build ' + _chalk2.default.green('- Build for production') + '\n    ' + (isYarn ? _chalk2.default.hex(_utils.ChalkColor.yarn)('yarn') : _chalk2.default.hex(_utils.ChalkColor.npm)('npm run')) + ' serve ' + _chalk2.default.green('- Test a production build locally') + '\n  ');
            }

          case 44:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  function create() {
    return _ref.apply(this, arguments);
  }

  return create;
}();

function shouldUseYarn() {
  try {
    (0, _child_process.execSync)('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}