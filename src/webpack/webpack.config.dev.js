import webpack from 'webpack'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import path from 'path'

import rules from './rules'
import { ROOT, DIST, NODE_MODULES, SRC } from '../paths'

export default function ({ config }) {
  return {
    context: path.resolve(__dirname, '../node_modules'),
    entry: [
      require.resolve('react-hot-loader/patch'),
      require.resolve('react-dev-utils/webpackHotDevClient'),
      require.resolve('webpack/hot/only-dev-server'),
      path.resolve(ROOT, config.entry),
    ],
    output: {
      filename: 'app.js',
      path: DIST,
      publicPath: '/',
    },
    module: {
      rules: rules({ stage: 'dev' }),
    },
    resolve: {
      modules: [path.resolve(__dirname, '../node_modules'), NODE_MODULES, SRC, DIST],
      extensions: ['.js', '.json', '.jsx'],
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
}
