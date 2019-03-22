import path from 'path'
import fs from 'fs-extra'

export function outputClientStats(state, statsJSON) {
  return fs.outputFileSync(
    path.join(state.config.paths.ARTIFACTS, 'client-stats.json'),
    JSON.stringify(statsJSON, null, 2)
  )
}

export async function importClientStats(state) {
  state.clientStats = await fs.readJson(
    path.join(state.config.paths.ARTIFACTS, 'client-stats.json')
  )
  if (!state.clientStats) {
    throw new Error('No Client Stats Found')
  }
}
