import { NODE_MODULES } from './paths'

export default [
  {
    test: /\.(js|jsx)$/,
    exclude: NODE_MODULES,
    use: [
      {
        loader: 'babel-loader',
      },
    ],
  },
  {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: 'url-loader',
    options: {
      limit: 10000,
    },
  },
  {
    exclude: [/\.js$/, /\.html$/, /\.json$/],
    loader: 'file-loader',
    options: {
      name: '[name].[hash:8].[ext]',
    },
  },
]
