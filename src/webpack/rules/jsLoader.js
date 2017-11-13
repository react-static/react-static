export default function ({ config }) {
  return {
    test: /\.(js|jsx)$/,
    exclude: config.paths.NODE_MODULES,
    use: [
      {
        loader: 'babel-loader',
      },
    ],
  }
}
