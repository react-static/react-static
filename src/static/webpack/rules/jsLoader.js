export default function ({ config, stage }) {
  return {
    test: /\.(js|jsx)$/,
    exclude: config.paths.EXCLUDE_MODULES,
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: stage !== 'prod',
        },
      },
    ],
  }
}
