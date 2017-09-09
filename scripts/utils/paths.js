import path from 'path'

export const ROOT = path.resolve('./')

const resolvePath = relativePath => path.resolve(ROOT, relativePath)

export const SRC = resolvePath('src')
export const DIST = resolvePath('dist')
export const PUBLIC = resolvePath('public')
export const NODE_MODULES = resolvePath('node_modules')
export const PACKAGE = resolvePath('package.json')
