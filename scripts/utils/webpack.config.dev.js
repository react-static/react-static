import webpack from 'webpack'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import DashboardPlugin from 'webpack-dashboard/plugin'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import rules from './rules'
import { DIST, NODE_MODULES, SRC } from './paths'

const port = process.env.PORT || '3000'

export default {
  context: SRC,
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${port}`,
    'webpack/hot/only-dev-server',
    './index',
  ],
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
    alias: {},
  },
  plugins: [
    new DashboardPlugin(),
    // new webpack.EnvironmentPlugin(['NODE_ENV', 'IS_STATIC']),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
    // new BundleAnalyzerPlugin(),
  ],
  devtool: 'eval-source-map',
}
