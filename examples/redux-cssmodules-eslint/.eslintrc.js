module.exports = {
  'parser': 'babel-eslint',
  'extends': [
    'react-tools',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'standard',
    'standard-react',
    'plugin:jsx-a11y/recommended',
    'plugin:css-modules/recommended'
  ],
  'plugins': [
    'import',
    'jsx-a11y',
    'html',
    'promise',
    'react',
    'standard',
    'css-modules'
  ],
  'env': {
    'browser': true,
    'es6': true
  },
  'globals': {
    '__DEV__': false,
    '__PROD__': false,
    '__PLAYER_DEBUG__': false,
    '__BASENAME__': false
  },
  'settings': {
    'ecmascript': 6,
    'import/resolver': 'webpack'
  },
  'rules': {
    'max-len': 'off',
    'no-nested-ternary': 'off',
    'camelcase': [
      2,
      {
        'properties': 'never'
      }
    ],
    'indent': 1,
    'semi': 0,
    'spaced-comment': 0,
    'brace-style': 0,
    'no-trailing-spaces': 0,
    'import/default': 2,
    'import/no-unresolved': [
      2,
      {
        'commonjs': true,
        'amd': true
      }
    ],
    'import/named': 2,
    'import/namespace': 2,
    'import/export': 2,
    'import/no-duplicates': 2,
    'import/imports-first': 2
  },
  'parserOptions': {
    'sourceType': 'module'
  }
}
