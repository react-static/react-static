import fs from 'fs-extra'
import path from 'path'
import { exec } from 'child_process'

const examples = path.resolve(__dirname, '../../../examples/')
const libExamples = path.resolve(__dirname, '../libExamples/')

async function init() {
  await fs.remove(libExamples)
  fs.copy(examples, libExamples, {
    filter: file => {
      return ![
        'tmp',
        'dist',
        '.DS_Store',
        'yarn.lock',
        '.log',
        '.tgz',
        'node_modules',
        '.history',
      ].some(d => file.includes(d))
    },
  })
}

// async function init() {
//   const files = await fs.readdir(examples)
//   files
//     .filter(d => !d.startsWith('.'))
//     .forEach(file => {
//       exec(
//         `cd ${path.resolve(
//           __dirname,
//           '../../../examples/',
//           file
//         )} && yarn add react@latest react-dom@latest`
//       )
//     })
// }

init()
