import webpack from 'webpack'
import path from 'path'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

//
import rules from './rules'
import { getConfig } from '../static'
import { ROOT, DIST, NODE_MODULES, SRC } from '../paths'

const defaultEntry = './src/index'
const config = getConfig()

export default {
  context: path.resolve(__dirname, '../node_modules'),
  entry: [path.resolve(ROOT, config.entry || defaultEntry)],
  output: {
    filename: 'app.js',
    path: DIST,
    publicPath: '/',
  },
  module: {
    rules,
  },
  resolve: {
    modules: [NODE_MODULES, path.resolve(__dirname, '../node_modules'), SRC, DIST],
    extensions: ['.js', '.json', '.jsx'],
    // alias: {
    //   'react-static-routes': path.resolve(DIST, 'react-static-routes.js'),
    // },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      ...process.env,
      NODE_ENV: 'production',
    }),
    new CaseSensitivePathsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    config.bundleAnalyzer ? new BundleAnalyzerPlugin() : null,
  ].filter(d => d),

  devtool: 'source-map',
}
