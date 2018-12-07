import fs from 'fs-extra'
import path from 'path'

init()

async function init() {
  const examples = await fs.readdir(
    path.resolve(__dirname, '../../../examples/')
  )
  return fs.writeFile(
    './lib/exampleList.json',
    JSON.stringify(examples, null, 2)
  )
}
