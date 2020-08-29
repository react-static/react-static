import PreactRefreshPlugin from '@prefresh/webpack'

export default () => ({
  webpack: config => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      react$: 'preact/compat',
      'react-dom$': 'preact/compat',
    }

    // removing react hot-loader from entries
    // and adding prefresh to plugins
    const newEntries = config.entry.filter(x => x !== 'react-hot-loader/patch')
    config.entry = newEntries

    config.plugins.push(new PreactRefreshPlugin())

    return config
  },
})
