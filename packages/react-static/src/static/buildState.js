import path from 'path'
import fs from 'fs-extra'

export async function outputBuildState(state) {
  await fs.outputFile(
    path.join(state.config.paths.ARTIFACTS, 'react-static-build-state.json'),
    JSON.stringify(state.config, null, 2)
  )
  return state
}

export function importBuildState(config) {
  return fs.readJson(
    path.join(config.paths.ARTIFACTS, 'react-static-build-state.json')
  )
}
