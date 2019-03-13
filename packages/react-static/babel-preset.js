const r = require.resolve

module.exports = (api, { external, modules, helpers } = {}) => {
  const { NODE_ENV, BABEL_ENV } = process.env
  const PRODUCTION = (BABEL_ENV || NODE_ENV) === 'production'

  // Turn on the cache
  api.cache(true)

  // This preset is for external node_modules only.
  if (external) {
    return {
      sourceType: 'unambiguous',
      presets: [
        r('@babel/preset-env'),
        {
          targets: {
            ie: 9,
          },
          ignoreBrowserslistConfig: true,
          useBuiltIns: false,
          modules: false,
        },
      ],
      plugins: [
        [
          r('@babel/plugin-transform-runtime'),
          {
            corejs: false,
            helpers: !!helpers,
            regenerator: true,
            useESModules: true,
          },
        ],
        r('@babel/plugin-syntax-dynamic-import'),
      ],
    }
  }

  // This preset is for react-static and user code
  return {
    presets: [
      [
        r('@babel/preset-env'),
        {
          targets: {
            browsers: PRODUCTION
              ? ['last 4 versions', 'safari >= 7', 'ie >= 9']
              : ['last 2 versions', 'not ie <= 11', 'not android 4.4.3'],
          },
          useBuiltIns: 'entry',
          modules,
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
          helpers: !!helpers,
          regenerator: true,
        },
      ],
      PRODUCTION && r('babel-plugin-transform-react-remove-prop-types'),
      r('@babel/plugin-syntax-dynamic-import'),
      r('@babel/plugin-proposal-class-properties'),
      r('@babel/plugin-proposal-optional-chaining'),
      r('@babel/plugin-proposal-export-default-from'),
    ],
  }
}
