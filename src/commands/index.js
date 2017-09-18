import 'babel-register'

import start from './start'
import build from './build'

export default function () {
  const cmd = process.argv[2]

  if (cmd === 'start') {
    start()
  }

  if (cmd === 'build') {
    build()
  }
}
