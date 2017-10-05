import 'babel-register'
import chalk from 'chalk'

require.extensions['.scss'] = () => {}
require.extensions['.css'] = () => {}

export default function () {
  const cmd = process.argv[2]

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

- ${chalk.green('create <project-name>')}  -  create a new project
- ${chalk.green('start')}  -  start the development server
- ${chalk.green('build')}  -  build site for production
`,
  )
}
