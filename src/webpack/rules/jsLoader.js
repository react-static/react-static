export default function ({ config, stage }) {
  return {
    test: /\.(js|jsx)$/,
    exclude: config.paths.NODE_MODULES,
    use: [
      {
        loader: 'babel-loader',
        options:
          stage === 'production'
            ? {
              compact: false,
            }
            : {},
      },
    ],
  }
}
