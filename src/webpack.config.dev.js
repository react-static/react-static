import webpack from 'webpack'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import path from 'path'

import rules from './rules'
import { getConfig } from './static'
import { ROOT, DIST, NODE_MODULES, SRC } from './paths'

const defaultEntry = './src/index'
const config = getConfig()
const port = process.env.PORT || '3000'

export default {
  context: path.resolve(__dirname, '../node_modules'),
  entry: [
    require.resolve('react-hot-loader/patch'),
    `${require.resolve('webpack-dev-server/client')}?http://localhost:${port}`,
    require.resolve('webpack/hot/only-dev-server'),
    path.resolve(ROOT, config.entry || defaultEntry),
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
    modules: [NODE_MODULES, path.resolve(__dirname, '../node_modules'), SRC, DIST],
    extensions: ['.js', '.json', '.jsx'],
    // alias: {
    //   'react-static-routes': path.resolve(DIST, 'react-static-routes.js'),
    // },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      ...process.env,
      NODE_ENV: 'development',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
  devtool: 'eval-source-map',
}
