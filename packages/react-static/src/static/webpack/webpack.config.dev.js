import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import path from 'path'

import rules from './rules'

export default function({ config }) {
  const { ROOT, DIST, NODE_MODULES, SRC, HTML_TEMPLATE } = config.paths

  process.env.REACT_STATIC_BASE_PATH = config.basePath
  process.env.REACT_STATIC_PUBLIC_PATH = config.publicPath
  process.env.REACT_STATIC_ASSETS_PATH = config.assetsPath

  const reactStaticTemplatesPath = path.join(DIST, 'react-static-templates.js')
  const reactStaticBrowserPluginsPath = path.join(
    DIST,
    'react-static-browser-plugins.js'
  )

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
      config.disableRuntime
        ? null
        : require.resolve('../../bootstrapTemplates'),
      path.resolve(ROOT, config.entry),
    ].filter(Boolean),
    output: {
      filename: '[name].js', // never hash dev code
      chunkFilename: 'templates/[name].js',
      path: DIST,
      publicPath: process.env.REACT_STATIC_ASSETS_PATH || '/',
    },
    module: {
      rules: rules({ config, stage: 'dev' }),
      strictExportPresence: true,
    },
    resolve: {
      alias: {
        'react-static/templates': reactStaticTemplatesPath,
        'react-static/plugins': reactStaticBrowserPluginsPath,
      },
      modules: [
        SRC,
        NODE_MODULES,
        'node_modules',
        path.resolve(__dirname, '../../../node_modules'),
        DIST,
      ],
      extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
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
