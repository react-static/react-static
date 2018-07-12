module.exports = () => {
  const { NODE_ENV, BABEL_ENV } = process.env

  const PRODUCTION = (BABEL_ENV || NODE_ENV) === 'production'

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: false,
          targets: {
            browsers: PRODUCTION
              ? ['last 4 versions', 'safari >= 7', 'ie >= 9']
              : ['last 2 versions', 'not ie <= 11', 'not android 4.4.3'],
          },
        },
      ],
      ['@babel/preset-react', { development: !PRODUCTION }],
    ],
    plugins: [
      !PRODUCTION && 'react-hot-loader/babel',
      'universal-import',
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: false,
          polyfill: false,
          regenerator: true,
          moduleName: 'babel-runtime',
        },
      ],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-export-default-from',
    ].filter(Boolean),
  }
}
