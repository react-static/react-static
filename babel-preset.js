module.exports = {
  presets: ['env', 'stage-0', 'react'],
  plugins: [
    [
      'universal-import'
    ],
    [
      'transform-runtime',
      {
        helpers: false,
        polyfill: false,
        regenerator: true,
        moduleName: 'babel-runtime',
      },
    ],
    'transform-class-properties',
  ],
  env: {
    development: {
      plugins: ['react-hot-loader/babel'],
    },
    test: {
      presets: ['env', 'stage-0', 'react'],
    },
  },
  compact: false,
}
