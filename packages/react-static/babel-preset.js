const r = require.resolve

module.exports = (api, options = {}) => {
  const { NODE_ENV, BABEL_ENV } = process.env

  const PRODUCTION = (BABEL_ENV || NODE_ENV) === 'production'

  return {
    presets: [
      [
        r('@babel/preset-env'),
        {
          modules: options.modules,
          useBuiltIns: 'entry',
          targets: {
            browsers: PRODUCTION
              ? ['last 4 versions', 'safari >= 7', 'ie >= 9']
              : ['last 2 versions', 'not ie <= 11', 'not android 4.4.3'],
          },
        },
      ],
      [r('@babel/preset-react'), { development: !PRODUCTION }],
    ],
    plugins: [
      r('babel-plugin-macros'),
      PRODUCTION
        ? r('babel-plugin-universal-import')
        : r('react-hot-loader/babel'),
      r('@babel/plugin-transform-destructuring'),
      [
        r('@babel/plugin-transform-runtime'),
        {
          helpers: false,
          regenerator: true,
        },
      ],
      PRODUCTION && r('babel-plugin-transform-react-remove-prop-types'),
      r('@babel/plugin-syntax-dynamic-import'),
      r('@babel/plugin-proposal-class-properties'),
      r('@babel/plugin-proposal-optional-chaining'),
      r('@babel/plugin-proposal-export-default-from'),
    ].filter(Boolean),
  }
}
