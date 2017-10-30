import path from 'path'
import os from 'os'

export const ROOT = path.resolve(process.cwd())

const resolvePath = relativePath => path.resolve(path.join(ROOT, relativePath))

export const LOCAL_NODE_MODULES = path.resolve(__dirname, '../node_modules')
export const SRC = resolvePath('src')
export const DIST = resolvePath('dist')
export const PUBLIC = resolvePath('public')
export const NODE_MODULES = resolvePath('node_modules')
export const PACKAGE = resolvePath('package.json')
export const HTML_TEMPLATE = `${os.tmpdir()}/react.static.template.html`
