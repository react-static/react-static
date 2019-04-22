const r = require.resolve

module.exports = (api, { external, hot, node, modules } = {}) => {
  const { NODE_ENV, REACT_STATIC_INTERNAL } = process.env
  const INTERNAL = REACT_STATIC_INTERNAL === 'true'
  const PRODUCTION = NODE_ENV === 'production'

  // Turn on the cache
  api.cache(true)

  // This is for compiling react-static's source modules
  if (INTERNAL) {
    return {
      presets: [r('@babel/preset-env'), r('@babel/preset-react')],
      plugins: [
        r('babel-plugin-universal-import'),
        r('@babel/plugin-transform-runtime'),
        r('@babel/plugin-transform-destructuring'),
        r('@babel/plugin-syntax-dynamic-import'),
        r('@babel/plugin-proposal-class-properties'),
        r('@babel/plugin-proposal-optional-chaining'),
        r('@babel/plugin-proposal-export-default-from'),
      ],
    }
  }

  // This preset is for external node_modules only.
  if (external) {
    return {
      sourceType: 'unambiguous',
      presets: [r('@babel/preset-env')],
      plugins: [
        [
          r('@babel/plugin-transform-runtime'),
          {
            corejs: false,
            useESModules: true,
          },
        ],
        r('@babel/plugin-syntax-dynamic-import'),
      ],
    }
  }

  if (node) {
    return {
      presets: [
        r('@babel/preset-env'),
        [r('@babel/preset-react'), { development: false }],
      ],
      plugins: [
        r('babel-plugin-macros'),
        r('@babel/plugin-syntax-dynamic-import'),
        r('@babel/plugin-transform-destructuring'),
        r('@babel/plugin-transform-runtime'),
        r('@babel/plugin-proposal-class-properties'),
        r('@babel/plugin-proposal-optional-chaining'),
        r('@babel/plugin-proposal-export-default-from'),
      ],
    }
  }

  // This preset is for react-static and user code
  return {
    presets: [
      r('@babel/preset-env'),
      [r('@babel/preset-react'), { development: !PRODUCTION }],
    ],
    plugins: [
      ...((modules && [r('@babel/plugin-transform-modules-commonjs')]) || []),
      ...((PRODUCTION && [
        r('babel-plugin-universal-import'),
        r('babel-plugin-transform-react-remove-prop-types'),
      ]) ||
        []),
      r('@babel/plugin-transform-runtime'),
      r('babel-plugin-macros'),
      r('@babel/plugin-transform-destructuring'),
      r('@babel/plugin-syntax-dynamic-import'),
      r('@babel/plugin-proposal-class-properties'),
      r('@babel/plugin-proposal-optional-chaining'),
      r('@babel/plugin-proposal-export-default-from'),
    ],
  }
}
