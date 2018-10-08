export default () => ({
  webpack: (config, { stage }) => {
    if (stage === 'prod') {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        react: 'preact-compat',
        'react-dom': 'preact-compat'
      }
    }
    return config
  },
})