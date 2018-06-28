const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

const exampleToError = new Map()

fs.readdirSync(path.resolve('./examples')).forEach(file => {
  if (file.startsWith('.')) {
    return
  }
  process.chdir(path.resolve(`./examples/${file}`))
  try {
    console.log(`${chalk.green(`Building ${file}`)}`)
    execSync('yarn')
    execSync('yarn link react-static')
    execSync('yarn build')
  } catch (er) {
    console.log(`${chalk.red(`Failed ${file}`)}`)
    exampleToError.set(file, er.stdout.toString('utf-8'))
  } finally {
    process.chdir('../../')
  }
})

for (const [example, errorMessage] of exampleToError.entries()) {
  console.log(`${chalk.bold.black.bgRed(`Error building ${example}`)}`)
  console.log(errorMessage)
}

if (exampleToError.size > 0) {
  process.exit(1)
}
