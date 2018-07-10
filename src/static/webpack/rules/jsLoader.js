export default function ({ config, stage }) {
  return {
    test: /\.(js|jsx)$/,
    exclude: new RegExp(`(/node_modules.*|${config.paths.EXCLUDE_MODULES})`),
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: stage !== 'prod',
        },
      },
      stage === 'dev' && {
        loader: 'react-hot-loader-loader',
      },
    ].filter(Boolean),
  }
}
