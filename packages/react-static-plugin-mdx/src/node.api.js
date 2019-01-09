export default ({ includePaths = [], ...rest }) => ({
  webpack: (config, { stage }) => {
    const babelLoaderPath = require.resolve('babel-loader')
    const mdxLoaderPath = require.resolve('@mdx-js/loader')

    config.module.rules[0].oneOf.unshift({
      test: /.mdx$/,
      include: ['src/pages/', ...includePaths],
      use: [babelLoaderPath, mdxLoaderPath],
    })

    return config
  },
}) 
