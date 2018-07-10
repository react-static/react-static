import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import path from 'path'

import rules from './rules'

export default function ({ config }) {
  const {
    ROOT, DIST, NODE_MODULES, SRC, HTML_TEMPLATE,
  } = config.paths

  process.env.REACT_STATIC_PUBLICPATH = config.devBasePath ? `/${config.devBasePath}/` : '/'
  process.env.REACT_STATIC_BASEPATH = config.devBasePath

  return {
    mode: 'development',
    optimization: {
      noEmitOnErrors: true,
      concatenateModules: true,
    },
    context: path.resolve(__dirname, '../../../node_modules'),
    entry: [
      require.resolve('react-dev-utils/webpackHotDevClient'),
      require.resolve('webpack/hot/only-dev-server'),
      path.resolve(ROOT, config.entry),
    ],
    output: {
      filename: '[name].js', // never hash dev code
      chunkFilename: 'templates/[name].js',
      path: DIST,
      publicPath: process.env.REACT_STATIC_PUBLICPATH || '/',
    },
    module: {
      rules: rules({ config, stage: 'dev' }),
    },
    resolve: {
      modules: [
        path.resolve(__dirname, '../../../node_modules'),
        'node_modules',
        NODE_MODULES,
        SRC,
        DIST,
      ],
      extensions: ['.js', '.json', '.jsx'],
    },
    plugins: [
      new webpack.EnvironmentPlugin(process.env),
      new HtmlWebpackPlugin({
        inject: true,
        template: `!!raw-loader!${HTML_TEMPLATE}`,
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new CaseSensitivePathsPlugin(),
      new ExtractCssChunks({ hot: true }),
    ],
    devtool: 'cheap-module-source-map',
  }
}
