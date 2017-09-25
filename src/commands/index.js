import 'babel-register'

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
    'Please use `react-static start` to start the development server and `react-static build` to build for production.',
  )
}
