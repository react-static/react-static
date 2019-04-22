import fs from 'fs-extra'
import babelPreset from '../../../../babel-preset'

// we check which babel config file exists in the project root
const readBabelConfig = root => {
  const babelFiles = [
    `${root}/.babelrc`,
    `${root}/.babelrc.js`,
    `${root}/babel.config.js`,
  ]

  let extendsFile = {}

  babelFiles.forEach(file => {
    try {
      fs.statSync(file)
      extendsFile = { extends: file }
    } catch (err) {
      // dont do anything
    }
  })

  return extendsFile
}

export default function({ config, stage }) {
  let babelFile = {}

  const isRelativePath = config.paths.DIST.startsWith(config.paths.ROOT)

  if (!isRelativePath) {
    babelFile = readBabelConfig(config.paths.ROOT)
  }

  return {
    test: /\.(js|jsx|mjs)$/,
    include: [
      config.paths.PLUGINS,
      config.paths.SRC,
      /react-static-templates\.js/,
      /react-static-browser-plugins\.js/,
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          ...babelFile,
          root: config.paths.ROOT,
          presets: [[babelPreset, { modules: false }]],
          cacheDirectory: isRelativePath ? stage !== 'prod' : config.paths.TEMP,
          compact: stage === 'prod',
          highlightCode: true,
        },
      },
      'react-hot-loader/webpack',
    ],
  }
}
