import fs from 'fs-extra'
import chalk from 'chalk'
import { time, timeEnd } from '../utils'

export default async function cleanDistDirectory(state) {
  // Remove the DIST folder
  console.log('Cleaning dist...')
  time(chalk.green('[\u2713] Dist cleaned'))
  await fs.remove(state.config.paths.DIST)
  timeEnd(chalk.green('[\u2713] Dist cleaned'))

  // Remove the ARTIFACTS folder
  console.log('Cleaning artifacts...')
  time(chalk.green('[\u2713] Artifacts cleaned'))
  await fs.remove(state.config.paths.ARTIFACTS)
  timeEnd(chalk.green('[\u2713] Artifacts cleaned'))

  // Empty ASSETS folder
  if (
    state.config.paths.ASSETS &&
    state.config.paths.ASSETS !== state.config.paths.DIST
  ) {
    console.log('Cleaning assets...')
    time(chalk.green('[\u2713] Assets cleaned'))
    await fs.emptyDir(state.config.paths.ASSETS)
    timeEnd(chalk.green('[\u2713] Assets cleaned'))
  }

  return state
}
