import PortFinder from 'portfinder'
import { performance } from 'perf_hooks'
//

// Export all shared utils
export * from '../browser/utils'

export { default as progress } from './progress'
export const ChalkColor = {
  yarn: '#2c8ebb',
  npm: '#cb3837',
}

export const findAvailablePort = start =>
  PortFinder.getPortPromise({
    port: start,
    stopPort: start + 1000,
  })

const times = {}
export function time(message) {
  times[message] = performance.now() / 1000
}
export function timeEnd(message) {
  if (times[message]) {
    let seconds = (performance.now() / 1000 - times[message]) * 10
    times[message] = null

    if (seconds < 0.1) {
      console.log(`${message}`)
      return
    }

    if (seconds < 1) {
      seconds = Math.round(seconds * 10) / 10
    } else {
      seconds = Math.round(seconds) / 10
    }
    console.log(`${message} (${seconds}s)`)
  }
}

export function debounce(func, wait, immediate) {
  let timeout
  return (...args) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

const escapeReg = /[\\^$.*+?()[\]{}|]/g
export function escapeRegExp(str) {
  return str.replace(escapeReg, '\\$&')
}
