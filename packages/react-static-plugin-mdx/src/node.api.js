export default ({
  includePaths = [],
  extensions = ['.md', '.mdx'],
  mdxOptions = {},
}) => ({
  afterGetConfig: ({ config }) => {
    config.extensions = [...config.extensions, ...extensions]
  },
  webpack: (webpackConfig, { defaultLoaders }) => {
    const mdxLoaderPath = require.resolve('@mdx-js/loader')

    webpackConfig.module.rules[0].oneOf.unshift({
      test: /.mdx?$/,
      include: [defaultLoaders.jsLoader.include, ...includePaths],
      use: [
        defaultLoaders.jsLoader.use[0],
        {
          loader: mdxLoaderPath,
          options: mdxOptions,
        },
      ],
    })

    return webpackConfig
  },
})
