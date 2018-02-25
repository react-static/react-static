import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

export const uglifyJSPlugin = new UglifyJSPlugin({
  cache: true,
  parallel: true,
  sourceMap: false,
  uglifyOptions: {
    ie8: false,
    ecma: 8,
    toplevel: true,
    mangle: {
      safari10: true,
      toplevel: true
    },
    output: {
      comments: false,
      beautify: false,
      ascii_only: true
    },
    compress: {
      dead_code: true
    },
    warnings: false
  }
})
