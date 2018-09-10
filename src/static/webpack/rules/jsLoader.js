import babelPreset from '../../../../babel-preset'

export default function({ stage }) {
  return {
    test: /\.(js|jsx|mjs)$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: [[babelPreset, { modules: false }]],
          cacheDirectory: stage !== 'prod',
          compact: stage === 'prod',
          highlightCode: true,
        },
      },
    ],
  }
}
