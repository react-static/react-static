// https://github.com/nozzle/react-static/blob/master/docs/plugins/node-api.md

// Paths Aliases defined through tsconfig.json
// more info: https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
// more info: https://github.com/marzelin/convert-tsconfig-paths-to-webpack-aliases
// Folders must be lowercase!
const convPaths = require('convert-tsconfig-paths-to-webpack-aliases').default
// Needs to be valid JSON. All comments in tsconfig.json must be removed.
const tsconfig = require('./tsconfig.json')

export default pluginOptions => ({
  webpack: (config, { defaultLoaders }) => {
    config.resolve.alias = convPaths(tsconfig)
    return config
  },
})
