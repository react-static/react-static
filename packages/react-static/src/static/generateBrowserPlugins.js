import path from 'path'
import slash from 'slash'
import fs from 'fs-extra'
//
import corePlugins from './plugins'

export default async state => {
  state = await corePlugins.beforePrepareBrowserPlugins(state)

  const { plugins, config } = state

  // A deduped list of pluginImports
  const pluginImports = []

  const recurse = plugins =>
    // Return an array of plugins
    `[${plugins
      .map(plugin => {
        const { browserLocation } = plugin

        // Add the plugin to the list of pluginImports
        let pluginIndex = browserLocation
          ? pluginImports.indexOf(browserLocation)
          : -1
        if (pluginIndex === -1 && browserLocation) {
          pluginImports.push(
            slash(path.relative(config.paths.ARTIFACTS, browserLocation))
          )
          pluginIndex = pluginImports.length - 1
        }

        const { location, plugins, options } = plugin

        // IIF to return the final plugin
        return `{
        location: "${slash(path.relative(config.paths.ARTIFACTS, location))}",
        plugins: ${recurse(plugins || [])},
        hooks: ${
          browserLocation
            ? `plugin${pluginIndex}(${JSON.stringify(options)})`
            : `{}`
        }
      }`
      })
      .join(',\n')}]`

  // Create the pluginsText
  const pluginsText = recurse(plugins || [])

  // Create the pluginImportsText
  const pluginImportsText = pluginImports
    .map((imp, index) => `import plugin${index} from '${imp}'`)
    .join('\n')

  // Create the file text
  const file = `// Imports
${pluginImportsText}

// Plugins
const plugins = ${pluginsText}

// Export em!
export default plugins`

  const targetPath = path.join(process.env.REACT_STATIC_PLUGINS_PATH)
  await fs.remove(targetPath)
  await fs.outputFile(targetPath, file)

  return corePlugins.afterPrepareBrowserPlugins(state)
}
