import path from 'path'

export default require(path.resolve(path.join(process.cwd(), 'static.config.js'))).default
