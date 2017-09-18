import 'babel-register'

import start from './start'
import build from './build'

export default function () {
  const cmd = process.argv[2]

  if (cmd === 'start') {
    return start()
  }

  if (cmd === 'build') {
    return build()
  }

  console.log(
    'Please use `react-static start` to start the development server and `react-static build` to build for production.',
  )
}
