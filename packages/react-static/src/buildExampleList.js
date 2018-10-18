import fs from 'fs-extra'
import path from 'path'

const examplePrefix = 'react-static-example-'

init()

async function init() {
  const packages = await fs.readdir(path.resolve(__dirname, '../../'))
  const examplePackages = packages
    .filter(d => d.includes(examplePrefix))
    .map(d => d.substring(examplePrefix.length))
  return fs.writeFile(
    './lib/exampleList.json',
    JSON.stringify(examplePackages, null, 2)
  )
}
