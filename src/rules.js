import path from 'path'
import { ROOT, SRC, NODE_MODULES } from './paths'

const env = process.env.NODE_ENV

export default [
  {
    test: /\.(js|jsx)$/,
    include: ROOT,
    exclude: NODE_MODULES,
    use: [
      {
        loader: 'babel-loader',
      },
    ],
  },

  // {
  //   test: [/\.js?$/, /\.jsx?$/],
  //   include: SRC,
  //   enforce: 'pre',
  //   use: [
  //     {
  //       loader: 'eslint-loader',
  //       options: {
  //         emitWarning: false,
  //       },
  //     },
  //   ],
  // },
  {
    test: /\.(gif|jpe?g|png|webp)$/,
    include: SRC,
    use: [
      {
        loader: 'url-loader',
        options: {
          name: path.join(
            '[path]',
            env === 'production' ? '[name].[hash:8].[ext]' : '[name].[ext]',
          ),
          limit: 10000,
        },
      },
    ],
  },

  {
    test: /\.(mp4|m4a|webm|ogv|oga|ogg|mp3|wav)$/,
    include: SRC,
    use: [
      {
        loader: 'url-loader',
        options: {
          name: path.join(
            '[path]',
            env === 'production' ? '[name].[hash:8].[ext]' : '[name].[ext]',
          ),
          limit: 10000,
        },
      },
    ],
  },
]
