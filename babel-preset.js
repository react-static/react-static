module.exports = {
  presets: [
    [
      'latest',
      {
        loose: true,
        modules: false,
      },
    ],
    'stage-0',
    'stage-3',
    'react',
  ],
  plugins: [
    [
      'universal-import',
      {
        disableWarnings: true,
      },
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
      presets: [['latest', { modules: true }], 'stage-0', 'stage-3', 'react'],
    },
  },
  compact: false,
}
