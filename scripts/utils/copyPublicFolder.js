import chalk from 'chalk'
import fs from 'fs-extra'
import { PUBLIC, DIST, INDEX } from './paths'

export default function copyPublicFolder () {
  fs.copySync(PUBLIC, DIST, {
    dereference: true,
    filter: file => file !== INDEX,
  })
  console.log(chalk.green('=>  [\u2713] Synced files from public to dist'))
}
