import path from 'path'
import fs from 'fs-extra'
import { chunkNameFromFile } from '../utils/chunkBuilder'

export default async state => {
  const {
    config: { paths },
    templates,
  } = state

  const file = `
${
  process.env.NODE_ENV === 'production'
    ? `
import React from 'react'
import universal, { setHasBabelPlugin } from 'react-universal-component'

setHasBabelPlugin()

const universalOptions = {
  loading: () => null,
  error: props => {
    console.error(props.error);
    return <div>An error occurred loading this page's template. More information is available in the console.</div>;
  },
  ignoreBabelRename: true
}

${templates
  .map((template, index) => {
    let chunkName = ''

    // relative resolving produces the wrong path, a "../" is missing
    // as the files looks equal, we simple use an absolute path then

    if (!paths.DIST.startsWith(paths.ROOT)) {
      chunkName = `/* webpackChunkName: "${chunkNameFromFile(template)}" */`
    }

    return `const t_${index} = universal(import('${template}'${chunkName}), universalOptions)
      t_${index}.template = '${template}'
      `
  })
  .join('\n')}

// Template Map
export default {
  ${templates.map((template, index) => `'${template}': t_${index}`).join(',\n')}
}
// Not Found Template
export const notFoundTemplate = ${JSON.stringify(templates[0])}
`
    : `

// Template Map
export default {
  ${templates
    .map(template => `'${template}': require('${template}').default`)
    .join(',\n')}
}

export const notFoundTemplate = '${templates[0]}'
`
}
`

  const dynamicRoutesPath = path.join(process.env.REACT_STATIC_TEMPLATES_PATH)
  await fs.remove(dynamicRoutesPath)
  await fs.outputFile(dynamicRoutesPath, file)

  // We have to wait here for a smidge, because webpack watcher is
  // overly aggressive on first start
  // await new Promise(resolve => setTimeout(resolve, 500))

  return state
}
