import fs from 'fs-extra'
import chalk from 'chalk'
//
import { time, timeEnd } from '../utils'

export default async function copyPublicFolder(state) {
  const {
    config: {
      paths: { PUBLIC, DIST, INDEX },
    },
  } = state

  console.log('Copying public directory...')
  time(chalk.green('[\u2713] Public directory copied'))

  await fs.ensureDir(PUBLIC)

  await fs.copy(PUBLIC, DIST, {
    dereference: true,
    filter: file => file !== INDEX,
  })

  timeEnd(chalk.green('[\u2713] Public directory copied'))

  return state
}
