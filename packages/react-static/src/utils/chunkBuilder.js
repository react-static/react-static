import path from 'path'

import { escapeRegExp } from '.'

// Instead of using path.sep, we always want to test for all of them. This makes
// the tests consistent and means we can write tests with either separator
const escapedPathSeps = escapeRegExp(`${path.win32.sep}${path.posix.sep}`)

export const chunkNameFromFile = filename => {
  // Normalize filename for path.join
  filename = filename.replace(new RegExp(`[${escapedPathSeps}]`, 'g'), path.sep)
  // Remove the extension
  return (
    path
      .join(
        path.dirname(filename),
        path.basename(filename, path.extname(filename))
      )
      // Remove the drive letter or leading (back)slash
      .replace(/^(?:[A-Z]:)?(?:\\|\/)/, '')
      // Now turn it into a name
      .replace(new RegExp(`[${escapedPathSeps}]`, 'g'), '-')
  )
}

export const absoluteToRelativeChunkName = (ROOT, chunkName) => {
  const pathPrefix = chunkNameFromFile(ROOT)

  // inner components can simply be added aswell
  if (!chunkName.startsWith(pathPrefix)) {
    return chunkName
  }

  // The templates starts with the absolute path, that's the one we want to
  // replace. It's length + 1 because otherwise it would start with a hyphen
  return chunkNameFromFile(chunkName).substring(pathPrefix.length + 1)
}
