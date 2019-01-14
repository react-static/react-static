export default ({ includePaths = [], ...rest }) => ({
  webpack: (webpackConfig, { stage, defaultLoaders }) => {
    const mdxLoaderPath = require.resolve('@mdx-js/loader')

    webpackConfig.module.rules[0].oneOf.unshift({
      test: /.mdx?$/,
      include: [ defaultLoaders.jsLoader.include, ...includePaths ],
      use: [defaultLoaders.jsLoader.use[0], mdxLoaderPath],
    })

    return webpackConfig
  },
})
