import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { progress, time, timeEnd, poolAll } from '../utils'

export default (async function exportSharedRouteData(state) {
  const {
    config: {
      outputFileRate,
      paths: { STATIC_DATA },
    },
    sharedDataByHash,
  } = state
  // Write all shared props to file
  const sharedDataArr = Array.from(sharedDataByHash)

  if (sharedDataArr.length) {
    console.log('Exporting Shared Route Data...')
    const jsonProgress = progress(sharedDataArr.length)
    time(chalk.green('[\u2713] Shared Route Data Exported'))

    await poolAll(
      sharedDataArr.map(cachedProp => async () => {
        await fs.outputFile(
          path.join(STATIC_DATA, `${cachedProp[1].hash}.json`),
          JSON.stringify(cachedProp[1].data)
        )
        jsonProgress.tick()
      }),
      Number(outputFileRate)
    )
    timeEnd(chalk.green('[\u2713] Shared Route Data Exported'))
  }

  return state
})
