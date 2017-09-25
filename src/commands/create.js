import fs from 'fs-extra'
import chalk from 'chalk'
import path from 'path'
import { execSync } from 'child_process'

export default async name => {
  if (!name) {
    console.log('=> A project name is required!')
    console.log('=> eg. react-static create my-new-project')
    return
  }

  console.log('=> Creating new react-static project...')
  console.time(chalk.green(`=> [\u2713] Project "${name}" created`))
  await fs.copy(path.resolve(__dirname, '../../demo'), path.resolve(process.cwd(), name))
  console.timeEnd(chalk.green(`=> [\u2713] Project "${name}" created`))

  const isYarn = shouldUseYarn()

  console.log()
  console.log(chalk.green('=> To install dependencies:'))
  console.log()
  console.log(`   cd ${name}`)
  console.log(`   ${isYarn ? 'yarn' : 'npm install'}`)
  console.log()
  console.log(chalk.green('=> To start the development server:'))
  console.log()
  console.log(`   ${isYarn ? 'yarn' : 'npm run'} start`)
  console.log()
  console.log(chalk.green('=> To build for production:'))
  console.log()
  console.log(`   ${isYarn ? 'yarn' : 'npm run'} build`)
  console.log()
}

function shouldUseYarn () {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}
