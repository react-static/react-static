export default function({ stage, isNode }) {
  if (stage === 'node' || isNode) {
    return {
      loader: 'url-loader',
      exclude: [/\.js$/, /\.html$/, /\.json$/],
      options: {
        limit: 10000,
        name: 'static/[name].[hash:8].[ext]',
      },
      // Don't generate extra files during node build
    }
  }
  return {
    loader: 'url-loader',
    exclude: [/\.js$/, /\.html$/, /\.json$/],
    query: {
      limit: 10000,
      name: 'static/[name].[hash:8].[ext]',
    },
  }
}
