const r = require.resolve

module.exports = (api, options = {}) => {
  const { NODE_ENV, BABEL_ENV } = process.env

  const PRODUCTION = (BABEL_ENV || NODE_ENV) === 'production'
  const DEVELOPMENT = (BABEL_ENV || NODE_ENV) === 'development'
  const TEST = (BABEL_ENV || NODE_ENV) === 'test'

  return {
    // Babel assumes ES Modules, which isn't safe until CommonJS
    // dies. This changes the behavior to assume CommonJS unless
    // an `import` or `export` is present in the file.
    // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
    sourceType: 'unambiguous',
    presets: [
      TEST && [
        // ES features necessary for user's Node version
        r('@babel/preset-env'),
        {
          targets: {
            node: 'current',
          },
          // Do not transform modules to CJS
          modules: false,
        },
      ],
      (PRODUCTION || DEVELOPMENT) && [
        // Latest stable ECMAScript features
        r('@babel/preset-env'),
        {
          // We want Create React App to be IE 9 compatible until React itself
          // no longer works with IE 9
          targets: {
            ie: 9,
          },
          // Users cannot override this behavior because this Babel
          // configuration is highly tuned for ES5 support
          ignoreBrowserslistConfig: true,
          // If users import all core-js they're probably not concerned with
          // bundle size. We shouldn't rely on magic to try and shrink it.
          useBuiltIns: false,
          // Do not transform modules to CJS
          modules: false,
        },
      ],
    ].filter(Boolean),
    plugins: [
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        r('@babel/plugin-transform-runtime'),
        {
          corejs: false,
          helpers: !!options.helpers,
          regenerator: true,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS
          // supports ES Modules.
          useESModules: DEVELOPMENT || PRODUCTION,
          // Undocumented option that lets us encapsulate our runtime, ensuring
          // the correct version is used
          // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
          // absoluteRuntime: absoluteRuntimePath,
        },
      ],
      // Adds syntax support for import()
      r('@babel/plugin-syntax-dynamic-import'),
      TEST &&
        // Transform dynamic import to require
        r('babel-plugin-transform-dynamic-import'),
    ].filter(Boolean),
  }
}
