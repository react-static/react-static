import babelPreset from 'babel-preset-react-static'

export default function() {
  return {
    test: /\.(js|jsx|mjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    use: [
      // 'thread-loader',
      {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          presets: [[babelPreset, { external: true, helpers: true }]],
          cacheDirectory: true,
          sourceMaps: false,
        },
      },
    ],
  }
}
