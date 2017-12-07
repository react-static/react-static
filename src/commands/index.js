import 'babel-register'
import chalk from 'chalk'
import fs from 'fs'

const ignoredExtensions = [
  'css',
  'scss',
  'styl',
  'less',
  'png',
  'gif',
  'jpg',
  'jpeg',
  'svg',
  'woff',
  'ttf',
  'eot',
  'otf',
  'mp4',
  'webm',
  'ogg',
  'mp3',
  'wav',
  'md',
  'yaml',
]
ignoredExtensions.forEach(ext => {
  require.extensions[`.${ext}`] = () => {}
})

export default function () {
  const cmd = process.argv[2]

  if (['-v', '--version'].indexOf(cmd) !== -1) {
    const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, 'utf8'))
    return console.log(packageJson.version)
  }

  if (cmd === 'start') {
    if (typeof process.env.NODE_ENV === 'undefined') {
      process.env.NODE_ENV = 'development'
    }
    process.env.REACT_STATIC_ENV = 'development'
    return require('./start').default()
  }

  if (cmd === 'build') {
    if (typeof process.env.NODE_ENV === 'undefined') {
      process.env.NODE_ENV = 'production'
    }
    process.env.REACT_STATIC_ENV = 'production'
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
