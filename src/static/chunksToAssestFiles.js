import React from 'react'
import fs from 'fs'

const DEV = process.env.NODE_ENV === 'development'

const isJs = file => /\.js$/.test(file) && !/\.hot-update\.js$/.test(file) && !/styles\.js/.test(file)

const isCss = file => /\.css$/.test(file)


const createCssHash = ({
  namedChunkGroup,
  publicPath,
}) => Object.keys(namedChunkGroup).reduce((hash, name) => {
  if (!namedChunkGroup[name]) return hash
  const file = namedChunkGroup[name].assets.find(file => file.endsWith('.css'))
  if (file) hash[name] = `${publicPath}${file}`
  return hash
}, {})

const stylesAsString = (
  stylesheets,
  outputPath
) => {
  if (!outputPath) {
    throw new Error(
      `No \`outputPath\` was provided as an option to \`flushChunks\`.
        Please provide one so stylesheets can be read from the
        file system since you're embedding the css as a string.`
    )
  }

  const path = outputPath.replace(/\/$/, '')

  return stylesheets
    .map(file => {
      const filePath = `${path}/${file}`
      return fs.readFileSync(filePath, 'utf8')
    })
    .join('\n')
    .replace(/\/\*# sourceMappingURL=.+\*\//g, '') // hide prod sourcemap err
}

const api = (scripts, styleSheets, namedChunkGroup, publicPath, outputPath) => {
  const cssHashRaw = createCssHash({ namedChunkGroup, publicPath })
  return {
    scripts,
    stylesheets: styleSheets,
    css: {
      toString: () => (DEV
        ? styleSheets
          .map(file => `<link rel='stylesheet' href='${outputPath}/${file}' />`)
          .join('\n')
        : `<style>${stylesAsString(styleSheets, outputPath)}</style>`
      ),
    },
    CssHash: () => (
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `window.__CSS_CHUNKS__ = ${JSON.stringify(cssHashRaw)}`,
        }}
      />
    ),
  }
}

const chunksToAssetFiles = (namedChunkGroup, opts) => {
  const chunkNames = ['main'].concat(opts.chunkNames)
  const { outputPath, publicPath } = opts

  let jsFiles = []
  let styleSheets = []
  chunkNames.forEach(name => {
    const assets = namedChunkGroup[name].assets
    jsFiles = jsFiles.concat(assets.filter(file => isJs(file)))
    styleSheets = styleSheets.concat(assets.filter(file => isCss(file)))
  })

  return api(
    jsFiles,
    styleSheets,
    namedChunkGroup,
    publicPath,
    outputPath
  )
}

module.exports = { chunksToAssetFiles }
