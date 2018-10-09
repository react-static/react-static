import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { progress, time, timeEnd, poolAll } from '../utils'

export default (async function exportSharedRouteData(config, sharedProps) {
  // Write all shared props to file
  const sharedPropsArr = Array.from(sharedProps)

  if (sharedPropsArr.length) {
    console.log('=> Exporting Shared Route Data...')
    const jsonProgress = progress(sharedPropsArr.length)
    time(chalk.green('=> [\u2713] Shared Route Data Exported'))

    await poolAll(
      sharedPropsArr.map(cachedProp => async () => {
        await fs.outputFile(
          path.join(config.paths.STATIC_DATA, `${cachedProp[1].hash}.json`),
          cachedProp[1].jsonString || '{}'
        )
        jsonProgress.tick()
      }),
      Number(config.outputFileRate)
    )
    timeEnd(chalk.green('=> [\u2713] Shared Route Data Exported'))
  }
})
