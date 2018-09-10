const { execSync } = require('child_process')
const fs = require('fs')
const chalk = require('chalk')

const exampleToError = new Map()

fs.readdirSync('./examples').forEach(
  file => {
    process.chdir(`./examples/${file}`)
    try {
      console.log(`${chalk.green(`Building ${file}`)}`)
      execSync('yarn install')
      execSync('rm -rf node_modules/react-static')
      execSync('ln -s -f ../../../ ./node_modules/react-static')
      execSync('../../bin/react-static build')
    } catch (er) {
      console.log(`${chalk.red(`Failed ${file}`)}`)
      exampleToError.set(file, er.stdout.toString('utf-8'))
    } finally {
      process.chdir('../../')
    }
  }
)


for (const [example, errorMessage] of exampleToError.entries()) {
  console.log(`${chalk.bold.black.bgRed(`Error building ${example}`)}`)
  console.log(errorMessage)
}

if (exampleToError.size > 0) {
  process.exit(1)
}

