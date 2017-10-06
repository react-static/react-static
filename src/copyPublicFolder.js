import fs from 'fs-extra'
import { PUBLIC, INDEX } from './paths'

export default function copyPublicFolder (dest) {
  fs.ensureDirSync(PUBLIC)

  fs.copySync(PUBLIC, dest, {
    dereference: true,
    filter: file => file !== INDEX,
  })
}
