// https://github.com/nozzle/react-static/blob/master/docs/plugins/node-api.md

// Paths Aliases defined through tsconfig.json
const typescriptWebpackPaths = require('./webpack.config.js')

export default pluginOptions => ({
  webpack: (config, { defaultLoaders }) => {
    config.resolve.alias = typescriptWebpackPaths.resolve.alias
    return config
  },
})
