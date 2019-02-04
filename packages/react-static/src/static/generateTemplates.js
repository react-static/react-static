import path from 'path'
import fs from 'fs-extra'
import { chunkNameFromFile } from '../utils/chunkBuilder'

export default async config => {
  const { templates, paths } = config

  // convert Windows-style path separators to the Unix style to ensure sure the
  // string literal is valid and doesn't contain escaped characters
  const reactStaticUniversalPath = process.env.REACT_STATIC_UNIVERSAL_PATH.split(
    '\\'
  ).join('/')

  const productionImports = `import universal, { setHasBabelPlugin } from '${reactStaticUniversalPath}'`
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
      let chunkName = ''

      // relative resolving produces the wrong path, a "../" is missing
      // as the files looks equal, we simple use an absolute path then
      if (!paths.DIST.startsWith(paths.ROOT)) {
        chunkName = `/* webpackChunkName: "${chunkNameFromFile(template)}" */`
      }

      return `const t_${index} = universal(import('${template}'${chunkName}), universalOptions)`
    })
    .join('\n')}
`

  const developmentTemplates = templates
    .map((template, index) => `import t_${index} from '${template}'`)
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

// Template Map
export default {
  ${templates.map((template, index) => `'${template}': t_${index}`).join(',\n')}
}

export const notFoundTemplate = ${JSON.stringify(templates[0])}
`

  const dynamicRoutesPath = path.join(process.env.REACT_STATIC_TEMPLATES_PATH)
  await fs.remove(dynamicRoutesPath)
  await fs.outputFile(dynamicRoutesPath, file)
}
