import path from 'path'
import fs from 'fs-extra'

export async function outputClientStats(state, statsJSON) {
  await fs.outputFile(
    path.join(state.config.paths.ARTIFACTS, 'client-stats.json'),
    JSON.stringify(statsJSON, null, 2)
  )
  return state
}

export async function importClientStats(state) {
  const clientStats = await fs.readJson(
    path.join(state.config.paths.ARTIFACTS, 'client-stats.json')
  )

  if (!clientStats) {
    throw new Error('No Client Stats Found')
  }

  return {
    ...state,
    clientStats,
  }
}
