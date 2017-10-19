import 'babel-register'
import chalk from 'chalk'
import fs from 'fs'

require.extensions['.scss'] = () => {}
require.extensions['.css'] = () => {}

export default function () {
  const cmd = process.argv[2]

  if (['-v', '--version'].indexOf(cmd) !== -1) {
    const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, 'utf8'))
    return console.log(packageJson.version)
  }

  if (cmd === 'start') {
    return require('./start').default()
  }

  if (cmd === 'build') {
    return require('./build').default()
  }

  if (cmd === 'create') {
    return require('./create').default(process.argv[3])
  }

  console.log(
    `
Usage: react-static <command>

- ${chalk.green('create')}  -  create a new project
- ${chalk.green('start')}  -  start the development server
- ${chalk.green('build')}  -  build site for production

Options:

    -v, --version output the version number
`,
  )
}
