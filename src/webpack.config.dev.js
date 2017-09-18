import webpack from 'webpack'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import DashboardPlugin from 'webpack-dashboard/plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import path from 'path'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import rules from './rules'
import { ROOT, DIST, NODE_MODULES, SRC } from './paths'

const port = process.env.PORT || '3000'

export default {
  context: path.resolve(__dirname, '../node_modules'),
  entry: [
    require.resolve('react-hot-loader/patch'),
    `${require.resolve('webpack-dev-server/client')}?http://localhost:${port}`,
    require.resolve('webpack/hot/only-dev-server'),
    path.join(SRC, './index.js'),
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
    modules: [NODE_MODULES, path.resolve(__dirname, '../node_modules'), SRC],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      '__static-config': path.join(ROOT, 'static.config.js'),
      react: path.resolve(__dirname, 'react.hot.js'),
      'react-dom': path.resolve(__dirname, 'react.hot.js'),
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new CaseSensitivePathsPlugin(),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
    // new BundleAnalyzerPlugin(),
  ],
  devtool: 'cheap-module-eval-source-map',
}
