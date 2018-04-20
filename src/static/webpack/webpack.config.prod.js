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

export default function ({ config, isNode }) {
  const {
    ROOT, DIST, NODE_MODULES, SRC,
  } = config.paths

  config.publicPath = process.env.REACT_STATIC_STAGING
    ? `${config.stagingSiteRoot}/${
      config.stagingBasePath ? `${config.stagingBasePath}/` : ''
    }`
    : `${config.siteRoot}/${config.basePath ? `${config.basePath}/` : ''}`

  process.env.REACT_STATIC_PUBLIC_PATH = config.publicPath
  process.env.REACT_STATIC_SITE_ROOT = process.env.REACT_STATIC_STAGING
    ? config.stagingSiteRoot
    : config.siteRoot
  process.env.REACT_STATIC_BASEPATH = process.env.REACT_STATIC_STAGING
    ? config.stagingBasePath
    : config.basePath

  return {
    context: path.resolve(__dirname, '../../../node_modules'),
    entry: path.resolve(ROOT, config.entry),
    output: {
      filename: isNode ? 'static.[chunkHash:8].js' : '[name].[chunkHash:8].js',
      chunkFilename: 'templates/[name].[chunkHash:8].js',
      path: DIST,
      publicPath: config.publicPath || '/',
      libraryTarget: isNode ? 'umd' : undefined,
    },
    target: isNode ? 'node' : undefined,
    externals: isNode
      ? [
        nodeExternals({
          whitelist: [
            'react-universal-component',
            'webpack-flush-chunks',
            'react-static-routes',
          ],
        }),
      ]
      : [],
    module: {
      rules: rules({ config, stage: 'prod', isNode }),
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
    plugins: [
      new webpack.EnvironmentPlugin(process.env),
      !isNode &&
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
      !isNode &&
        new webpack.optimize.CommonsChunkPlugin({
          name: 'bootstrap', // Named bootstrap to support the webpack-flush-chunks plugin
          minChunks: Infinity,
        }),
      isNode &&
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      !isNode &&
        !process.env.REACT_STATIC_DEBUG &&
        new webpack.optimize.UglifyJsPlugin(),
      // !isNode &&
      //   new SWPrecacheWebpackPlugin({
      //     cacheId: config.siteName || 'my-site-name',
      //     dontCacheBustUrlsMatching: /\.\w{8}\./,
      //     filename: 'service-worker.js',
      //     minify: true,
      //     navigateFallback: '/index.html',
      //     staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      //   }),
      // !isNode &&
      //   new WebpackPwaManifest({
      //     name: config.pwa.name || 'My React Static App',
      //     short_name: config.pwa.shortName || 'My React Static App',
      //     description: config.pwa.description || 'An app I built with React Static!',
      //     background_color: config.pwa.backgroundColor || '#01579b',
      //     theme_color: config.pwa.themeColor || '#01579b',
      //     'theme-color': config.pwa.themeColor || '#01579b',
      //     start_url: config.pwa.startUrl || '/',
      //     icons: [],
      //     icons: [
      //       {
      //         src: path.resolve('src/images/icon.png'),
      //         sizes: [96, 128, 192, 256, 384, 512],
      //         destination: path.join('assets', 'icons'),
      //       },
      //     ],
      //   }),
      config.bundleAnalyzer && !isNode && new BundleAnalyzerPlugin(),
    ].filter(d => d),

    devtool: 'source-map',
  }
}
