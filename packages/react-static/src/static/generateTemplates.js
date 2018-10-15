import path from 'path'
import slash from 'slash'
import fs from 'fs-extra'
import { chunkNameFromFile } from '../utils/chunkBuilder'

export default async ({ config }) => {
  const { templates, routes, paths } = config

  const route404 = routes.find(route => route.path === '404')
  const id404 = route404.templateIndex

  const productionImports = `
import universal, { setHasBabelPlugin } from 'react-universal-component'
  `
  const developmentImports = ''

  const productionTemplates = `
setHasBabelPlugin()

const universalOptions = {
  loading: () => null,
  error: props => {
    console.error(props.error);
    return <div>An error occurred loading this page's template. More information is available in the console.</div>;
  },
}

${templates
    .map((template, index) => {
      let templatePath = path.relative(
        paths.DIST,
        path.resolve(paths.ROOT, template)
      )

      let chunkName = ''

      // relative resolving produces the wrong path, a "../" is missing
      // as the files looks equal, we simple use an absolute path then
      if (!paths.DIST.startsWith(paths.ROOT)) {
        templatePath = path.resolve(paths.ROOT, template)

        chunkName = `/* webpackChunkName: "${chunkNameFromFile(template)}" */`
      }

      return `const t_${index} = universal(import('${slash(
        templatePath
      )}'${chunkName}), universalOptions)`
    })
    .join('\n')}
`

  const developmentTemplates = templates
    .map((template, index) => {
      const templatePath = path.relative(
        paths.DIST,
        path.resolve(paths.ROOT, template)
      )
      return `import t_${index} from '${slash(templatePath)}'`
    })
    .join('\n')

  const file = `
${
    process.env.NODE_ENV === 'production'
      ? productionImports
      : developmentImports
  }

${
    process.env.NODE_ENV === 'production'
      ? productionTemplates
      : developmentTemplates
  }

export const template404ID = ${id404}

// Template Map
export default [
  ${templates.map((template, index) => `t_${index}`).join(',\n')}
]
`

  const dynamicRoutesPath = path.join(paths.DIST, 'react-static-templates.js')
  await fs.remove(dynamicRoutesPath)
  await fs.outputFile(dynamicRoutesPath, file)
}
