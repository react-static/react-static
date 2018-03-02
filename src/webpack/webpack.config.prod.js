import webpack from 'webpack'
import path from 'path'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import nodeExternals from 'webpack-node-externals'
import shorthash from 'shorthash'
// import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'
// import WebpackPwaManifest from 'webpack-pwa-manifest'
//
import rules from './rules'

export default function ({ config, isNode }) {
  const { ROOT, DIST, NODE_MODULES, SRC } = config.paths
  const publicPath = process.env.REACT_STATIC_STAGING ? '/' : `${config.siteRoot}/` || '/'
  process.env.PUBLIC_PATH = publicPath
  process.env.ROUTE_INFO_HASH = shorthash.unique(JSON.stringify(config.routes))
  process.env.ROUTE_INFO_URL = `${publicPath}routeInfo.${process.env.ROUTE_INFO_HASH}.js`

  return {
    mode: 'production',

    optimization: {
      minimize: !isNode && !process.env.REACT_STATIC_DEBUG,
    },

    context: path.resolve(__dirname, '../node_modules'),
    entry: path.resolve(ROOT, config.entry),
    output: {
      filename: isNode ? 'static.[chunkHash:8].js' : '[name].[chunkHash:8].js',
      chunkFilename: 'templates/[name].[chunkHash:8].js',
      path: DIST,
      publicPath,
      libraryTarget: isNode ? 'umd' : undefined,
    },
    target: isNode ? 'node' : undefined,
    externals: isNode
      ? [
        nodeExternals({
          whitelist: ['react-universal-component', 'webpack-flush-chunks', 'react-static-routes'],
        }),
      ]
      : [],
    module: {
      rules: rules({ config, stage: 'prod' }),
    },
    resolve: {
      alias: config.preact
        ? {
          react: 'preact-compat',
          'react-dom': 'preact-compat',
        }
        : {},
      modules: [
        path.resolve(__dirname, '../node_modules'),
        'node_modules',
        NODE_MODULES,
        SRC,
        DIST,
      ],
      extensions: ['.js', '.json', '.jsx'],
    },
    plugins: [
      new webpack.EnvironmentPlugin(process.env),
      new ExtractTextPlugin({
        filename: getPath => {
          process.env.extractedCSSpath = getPath('styles.[hash:8].css')
          return process.env.extractedCSSpath
        },
        allChunks: true,
      }),
      new CaseSensitivePathsPlugin(),
      // isNode &&
      //   new webpack.optimize.LimitChunkCountPlugin({
      //     maxChunks: 1,
      //   }),
      // config.bundleAnalyzer && !isNode && new BundleAnalyzerPlugin(),
    ].filter(d => d),

    devtool: 'source-map',
  }
}
