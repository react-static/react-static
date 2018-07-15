export const webpack = (config, { defaultLoaders }) => {
  config.resolve.extensions.push('.ts', '.tsx')

  config.module.rules[0].oneOf.unshift({
    test: /\.(ts|tsx)$/,
    exclude: defaultLoaders.jsLoader.exclude,
    use: [
      {
        loader: 'babel-loader',
      },
      {
        loader: require.resolve('ts-loader'),
        options: {
          compilerOptions: {
            jsx: 'preserve',
            noEmit: false,
          },
        },
      },
    ],
  })

  return config
}
