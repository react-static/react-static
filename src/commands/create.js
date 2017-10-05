import fs from 'fs-extra'
import chalk from 'chalk'
import path from 'path'
import { execSync } from 'child_process'
import inquirer from 'inquirer'

export default async name => {
  if (!name) {
    console.log('=> A project name is required!')
    console.log('=> eg. react-static create my-new-project')
    return
  }

  const files = await fs.readdir(path.resolve(__dirname, '../../examples/'))

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'dest',
      message: 'What should we name this project?',
      default: 'my-static-site',
    },
    {
      type: 'list',
      name: 'styleFormat',
      message: 'Select a template from below...',
      choices: files.filter(d => !d.startsWith('.')),
    },
  ])

  console.log('=> Creating new react-static project...')
  console.time(chalk.green(`=> [\u2713] Project "${name}" created`))
  const dest = path.resolve(process.cwd(), answers.dest)
  await fs.copy(path.resolve(__dirname, `../../examples/${answers.template}`), dest)
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
