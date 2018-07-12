import path from 'path'
import { execSync } from 'child_process'
import fs from 'fs-extra'

async function main () {
  const files = await fs.readdir(path.resolve('./examples/'))
  files.forEach(file => {
    if (file.startsWith('.')) {
      return
    }
    const command = `cd examples/${file} && yarn add react-hot-loader@latest`
    console.log(command)
    execSync(command, { stdio: [0, 1, 2] })
  })
}

main()
