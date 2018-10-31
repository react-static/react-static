import babelPreset from '../../../../babel-preset-external'

export default function({ config }) {
  return {
    test: /\.(js|jsx|mjs)$/,
    exclude: [
      /@babel(?:\/|\\{1,2})runtime/,
      ...config.babelExcludes || []
    ],
    use: [
      // 'thread-loader',
      {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          presets: [[babelPreset, { helpers: true }]],
          cacheDirectory: true,
          sourceMaps: false,
        },
      },
    ],
  }
}
