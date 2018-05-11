import webpack from 'webpack'
import path from 'path'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import nodeExternals from 'webpack-node-externals'
// import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'
// import WebpackPwaManifest from 'webpack-pwa-manifest'
//
import rules from './rules'


function common (config) {
  const {
    ROOT, DIST, NODE_MODULES, SRC,
  } = config.paths

  // Trailing slash
  config.publicPath = process.env.REACT_STATIC_STAGING
    ? `${config.stagingSiteRoot}/${config.stagingBasePath ? `${config.stagingBasePath}/` : ''}`
    : `${config.siteRoot}/${config.basePath ? `${config.basePath}/` : ''}`
  process.env.REACT_STATIC_PUBLIC_PATH = config.publicPath

  // Trailing slash mysiteroot.com/
  process.env.REACT_STATIC_SITE_ROOT = `${
    process.env.REACT_STATIC_STAGING ? config.stagingSiteRoot : config.siteRoot
  }/`

  // No slashes base/path
  process.env.REACT_STATIC_BASEPATH = process.env.REACT_STATIC_STAGING
    ? config.stagingBasePath
    : config.basePath

  return {
    context: path.resolve(__dirname, '../../../node_modules'),
    entry: path.resolve(ROOT, config.entry),
    output: {
      filename: '[name].[chunkHash:8].js',
      chunkFilename: 'templates/[name].[chunkHash:8].js',
      path: DIST,
      publicPath: config.publicPath || '/',
    },
    module: {
      rules: rules({ config, stage: 'prod', isNode: false }),
    },
    resolve: {
      alias: config.preact
        ? {
          react: 'preact-compat',
          'react-dom': 'preact-compat',
        }
        : {},
      modules: [
        path.resolve(__dirname, '../../../node_modules'),
        'node_modules',
        NODE_MODULES,
        SRC,
        DIST,
      ],
      extensions: ['.js', '.json', '.jsx'],
    },
    externals: [],
    target: undefined,
    plugins: [
      new webpack.EnvironmentPlugin(process.env),
      (config.extractCssChunks
        ? new ExtractCssChunks()
        : new ExtractTextPlugin({
          filename: getPath => {
            process.env.extractedCSSpath = getPath('styles.[hash:8].css')
            return process.env.extractedCSSpath
          },
          allChunks: true,
        })),
      new CaseSensitivePathsPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'bootstrap', // Named bootstrap to support the webpack-flush-chunks plugin
        minChunks: Infinity,
      }),
      !process.env.REACT_STATIC_DEBUG && new webpack.optimize.UglifyJsPlugin(),
      config.bundleAnalyzer && new BundleAnalyzerPlugin(),
    ].filter(d => d),
    devtool: 'source-map',
  }
}

export default function ({ config, isNode }) {
  const result = common(config)
  if (!isNode) return result
  result.output.filename = 'static.[chunkHash:8].js'
  result.output.libraryTarget = 'umd'
  result.target = 'node'
  result.externals = [
    nodeExternals({
      whitelist: ['react-universal-component', 'webpack-flush-chunks', 'react-static-routes'],
    }),
  ]
  //
  // module.rules
  result.module.rules = rules({ config, stage: 'prod', isNode: true })
  result.plugins = [
    new webpack.EnvironmentPlugin(process.env),
    new CaseSensitivePathsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ]
  return result
}
