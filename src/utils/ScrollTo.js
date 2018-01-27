import raf from 'raf'
//
const ease = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

const defaultOptions = {
  duration: 800,
  offset: 0,
  context: typeof window !== 'undefined' && window
}

const getTop = (element, offset) =>
  element.getBoundingClientRect().top + window.pageYOffset + offset

const getPosition = (start, end, elapsed, duration, easeFn) => {
  if (elapsed > duration) return end
  return start + (end - start) * easeFn(elapsed / duration)
}

export default function scrollTo (element, options) {
  const { duration, offset, callback, context } = { ...defaultOptions, ...options }
  const start = window.pageYOffset
  const end = typeof element === 'number' ? parseInt(element) : getTop(element, offset)
  const clock = Date.now() - 1
  const step = () => {
    const elapsed = Date.now() - clock
    if (context !== window) {
      context.scrollTop = getPosition(start, end, elapsed, duration, ease)
    } else {
      window.scroll(0, getPosition(start, end, elapsed, duration, ease))
    }

    if (elapsed > duration) {
      if (typeof callback === 'function') {
        callback(element)
      }
    } else {
      raf(step)
    }
  }
  raf(step)
}
