import babelPreset from '../../../../babel-preset'

export default function({ config }) {
  return {
    test: /\.(js|jsx|mjs)$/,
    exclude: [/@babel(?:\/|\\{1,2})runtime/, ...(config.babelExcludes || [])],
    use: [
      {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          presets: [[babelPreset, { external: true }]],
          cacheDirectory: true,
          sourceMaps: false,
        },
      },
      'react-hot-loader/webpack',
    ],
  }
}
