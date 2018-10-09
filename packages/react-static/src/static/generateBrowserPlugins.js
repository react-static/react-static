import path from 'path'
import slash from 'slash'
import fs from 'fs-extra'

export default async ({ config }) => {
  const { paths } = config

  // A deduped list of imports
  const imports = []

  const recurse = plugins =>
    // Return an array of plugins
    `[${plugins
      .map(plugin => {
        const { browserResolver } = plugin

        // Add the plugin to the list of imports
        let impIndex = browserResolver ? imports.indexOf(browserResolver) : -1
        if (impIndex === -1 && browserResolver) {
          imports.push(slash(browserResolver))
          impIndex = imports.length - 1
        }

        // IIF to return the final plugin
        return `(() => {
  const plugin = ${JSON.stringify(plugin)}
  return {
    ...plugin,
    plugins: ${recurse(plugin.plugins || [])},
    hooks: ${browserResolver ? `imp${impIndex}(plugins.options)` : `{}`}
  }
})()`
      })
      .join(',\n')}]`

  // Create the pluginsText
  const pluginsText = recurse(config.plugins || [])

  // Create the importsText
  const importsText = imports
    .map((imp, index) => `import imp${index} from '${imp}'`)
    .join('\n')

  // Create the file text
  const file = `// Imports
${importsText}

// Plugins
const plugins = ${pluginsText}

// Export em!
export default plugins`

  const targetPath = path.join(paths.DIST, 'react-static-browser-plugins.js')
  await fs.remove(targetPath)
  await fs.outputFile(targetPath, file)
}
