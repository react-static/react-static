export default ({ includePaths = [], extensions = ['.md', '.mdx'] }) => ({
  config: config => {
    config.extensions = [...config.extensions, ...extensions]
  },
  webpack: (webpackConfig, { defaultLoaders }) => {
    const mdxLoaderPath = require.resolve('@mdx-js/loader')

    webpackConfig.module.rules[0].oneOf.unshift({
      test: /.mdx?$/,
      include: [defaultLoaders.jsLoader.include, ...includePaths],
      use: [defaultLoaders.jsLoader.use[0], mdxLoaderPath],
    })

    return webpackConfig
  },
})
