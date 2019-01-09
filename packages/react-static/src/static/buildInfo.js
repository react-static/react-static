import path from 'path'
import fs from 'fs-extra'

export function outputBuildInfo(config) {
  return fs.outputFileSync(
    path.join(config.paths.DIST, 'react-static-build-config.json'),
    JSON.stringify(config, null, 2)
  )
}

export function importBuildInfo(config) {
  return fs.readJson(
    path.join(config.paths.DIST, 'react-static-build-config.json')
  )
}
