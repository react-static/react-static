import webpack from 'webpack'
import ImageminPlugin from 'imagemin-webpack-plugin'
import path from 'path'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
//
import rules from './rules'
import { DIST, NODE_MODULES, SRC } from './paths'

export default {
  context: SRC,
  entry: ['babel-polyfill', path.join(SRC, 'index.js')],
  output: {
    filename: 'app.js',
    path: DIST,
    publicPath: '/',
  },
  module: {
    rules,
  },
  resolve: {
    modules: [`${NODE_MODULES}`, `${SRC}`],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'IS_STATIC']),
    new webpack.optimize.UglifyJsPlugin(),
    new ImageminPlugin({
      gifsicle: {
        interlaced: true,
      },
      jpegtran: {
        progressive: true,
      },
    }),
    // new BundleAnalyzerPlugin(),
  ],

  devtool: 'source-map',

  performance: {
    hints: 'warning',
  },

  profile: true,
}
