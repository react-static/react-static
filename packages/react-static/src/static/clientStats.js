import path from 'path'
import fs from 'fs-extra'

export function outputClientStats(config, statsJSON) {
  return fs.outputFileSync(
    path.join(config.paths.DIST, 'client-stats.json'),
    JSON.stringify(statsJSON, null, 2)
  )
}

export async function importClientStats(config) {
  const clientStats = await fs.readJson(
    path.join(config.paths.DIST, 'client-stats.json')
  )
  if (!clientStats) {
    throw new Error('No Client Stats Found')
  }
  return clientStats
}
