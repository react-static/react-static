import webpack from 'webpack'
import path from 'path'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

//
import rules from './rules'
import { getConfig } from './static'
import { DIST, NODE_MODULES, SRC } from './paths'

const config = getConfig()

export default {
  context: path.resolve(__dirname, '../node_modules'),
  entry: [path.join(SRC, 'index.js')],
  output: {
    filename: 'app.js',
    path: DIST,
    publicPath: '/',
  },
  module: {
    rules,
  },
  resolve: {
    modules: [NODE_MODULES, path.resolve(__dirname, '../node_modules'), SRC],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      '__static-config': path.resolve(__dirname, 'empty-config.js'),
      ...(config.usePreact
        ? {
          react: path.resolve(__dirname, 'react.hot.js'),
          'react-dom': path.resolve(__dirname, 'react.hot.js'),
        }
        : {}),
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new CaseSensitivePathsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    // new BundleAnalyzerPlugin(),
  ],

  devtool: 'source-map',

  performance: {
    hints: false,
  },

  profile: true,
}
