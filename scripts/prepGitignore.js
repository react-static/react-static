#!/usr/bin/env node

// Be sure to log useful information about unhandled exceptions. This should seriously
// be a default: https://github.com/nodejs/node/issues/9523#issuecomment-259303079
process.on('unhandledRejection', r => {
  console.log('')
  console.log('UnhandledPromiseRejectionWarning: Unhandled Promise Rejection')
  console.log(r)
})

const path = require('path')
const fs = require('fs-extra')

const examplesDir = path.resolve(__dirname, '../examples/')

fs
  .readdir(examplesDir)
  .then(files =>
    Promise.all(
      files
        .filter(d => !d.startsWith('.'))
        .map(file =>
          fs.copy(
            path.join(examplesDir, file, '.gitignore'),
            path.join(examplesDir, file, 'gitignore')
          )
        )
    )
  )
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
