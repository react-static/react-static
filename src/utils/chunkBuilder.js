import path from 'path'

export const chunkNameFromFile = filename => {
  const chunkName = filename
    .replace(path.extname(filename), '') // extension
    .replace(new RegExp(`[${path.sep}]`, 'g'), '-') // slash to -

  if (chunkName[0] === '-') {
    return chunkName.substr(1)
  }

  return chunkName
}

export const absoluteToRelativeChunkName = (ROOT, chunkName) => {
  const pathPrefix = ROOT.replace(new RegExp(`[${path.sep}]`, 'g'), '-').substr(
    1
  )

  // inner components can simply be added aswell
  if (!chunkName.startsWith(pathPrefix)) {
    return chunkName
  }

  // the templates starts with the absolute path, thats the ones we want to replace
  let relativeChunkName = chunkName.replace(
    new RegExp(`${pathPrefix}`, 'g'),
    ''
  )

  // cut of the extension if any
  if (relativeChunkName.indexOf('.')) {
    relativeChunkName = relativeChunkName.substr(
      0,
      relativeChunkName.indexOf('.')
    )
  }

  return relativeChunkName
}
