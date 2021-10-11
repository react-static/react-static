export default (options = {}) => ({
  webpack(config) {
    const moduleRules = config.module.rules[0].oneOf

    moduleRules.unshift({
      test: /\.svg$/,
      use: [
        {
          loader: require.resolve('@svgr/webpack'),
          options,
        },
      ],
    })

    return config
  },
})
