const path = require('path')

export default ({
  includePaths = [],
  extensions = ['.md', '.mdx'],
  mdxOptions = {},
  parseFrontMatter = false,
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
        parseFrontMatter && path.join(__dirname, './loader/fm-loader'),
      ].filter(x => x), // Remove falsy value when not parsing front matter
    })

    return webpackConfig
  },
})
