import webpack from 'webpack'
import path from 'path'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import nodeExternals from 'webpack-node-externals'
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import rules from './rules'

function common(config) {
  const { ROOT, DIST, NODE_MODULES, SRC, ASSETS } = config.paths

  process.env.REACT_STATIC_ENTRY_PATH = path.resolve(ROOT, config.entry)
  process.env.REACT_STATIC_SITE_ROOT = config.siteRoot
  process.env.REACT_STATIC_BASE_PATH = config.basePath
  process.env.REACT_STATIC_PUBLIC_PATH = config.publicPath
  process.env.REACT_STATIC_ASSETS_PATH = config.assetsPath

  if (!DIST.startsWith(ROOT)) {
    // we build outside of project dir, so reset some paths
    process.env.REACT_STATIC_ASSETS_PATH = config.assetsPath.replace(DIST, '')
  }

  const splitChunks = {
    chunks: 'all',
    minSize: 10000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 5,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        chunks: 'all',
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  }

  let extrackCSSChunks = new ExtractCssChunks({
    filename: '[name].[chunkHash:8].css',
    chunkFilename: '[id].[chunkHash:8].css',
  })

  if (!config.extractCssChunks) {
    splitChunks.cacheGroups = {
      styles: {
        name: 'styles',
        test: /\.css$/,
        chunks: 'all',
        enforce: true,
      },
    }
    extrackCSSChunks = new ExtractCssChunks({
      filename: '[name].[chunkHash:8].css',
    })
  }

  return {
    mode: 'production',
    context: path.resolve(__dirname, '../../../node_modules'),
    entry: config.disableRuntime
      ? path.resolve(ROOT, config.entry)
      : [
          require.resolve('../../bootstrapTemplates'),
          require.resolve('../../bootstrapApp'),
        ],
    output: {
      filename: '[name].[hash:8].js', // dont use chunkhash, its not a chunk
      chunkFilename: 'templates/[name].[chunkHash:8].js',
      path: ASSETS,
      publicPath: process.env.REACT_STATIC_ASSETS_PATH || '/',
    },
    optimization: {
      sideEffects: true,
      minimize: true,
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true, // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      splitChunks,
    },
    module: {
      rules: rules({ config, stage: 'prod', isNode: false }),
      strictExportPresence: true,
    },
    resolve: {
      modules: [
        ...[
          SRC,
          NODE_MODULES,
          path.resolve(__dirname, '../../../node_modules'),
          DIST,
        ].map(d =>
          DIST.startsWith(ROOT)
            ? path.relative(process.cwd(), d)
            : path.resolve(d)
        ),
        'node_modules',
      ],
      extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
    },
    externals: [],
    target: undefined,
    plugins: [
      new webpack.EnvironmentPlugin(process.env),
      extrackCSSChunks,
      new CaseSensitivePathsPlugin(),
      config.bundleAnalyzer && new BundleAnalyzerPlugin(),
    ].filter(d => d),
    devtool: 'source-map',
  }
}

export default function({ config, isNode }) {
  const result = common(config)
  if (!isNode) return result

  // Node only!!!
  result.output.filename = 'static.[chunkHash:8].js'
  result.output.libraryTarget = 'umd'
  result.optimization.minimize = false
  result.optimization.minimizer = []
  result.target = 'node'
  result.externals = [
    nodeExternals({
      whitelist: [
        'react-universal-component',
        'webpack-flush-chunks',
        'react-static',
      ],
    }),
  ]
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
