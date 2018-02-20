import raf from 'raf'
//
const ease = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

const defaultOptions = {
  duration: 800,
  offset: 0,
  context: typeof window !== 'undefined' && window,
}

const getTop = (element, offset, contextScrollHeight, contextVisibleHeight) =>
  Math.min(
    element.getBoundingClientRect().top + window.pageYOffset + offset,
    contextScrollHeight - contextVisibleHeight
  )

const getPosition = (start, end, elapsed, duration, easeFn) => {
  if (elapsed > duration) return end
  return start + (end - start) * easeFn(elapsed / duration)
}

export default function scrollTo (element, options) {
  const { duration, offset, context } = { ...defaultOptions, ...options }
  const start = window.pageYOffset
  let innerHeight
  let scrollHeight
  if (context !== window) {
    innerHeight = context.offsetHeight
    scrollHeight = context.scrollHeight
  } else {
    innerHeight = window.innerHeight
    scrollHeight = document.body.scrollHeight
  }
  const clock = Date.now() - 1
  return new Promise(resolve => {
    const step = () => {
      const elapsed = Date.now() - clock
      const end =
        typeof element === 'number'
          ? parseInt(element)
          : getTop(element, offset, scrollHeight, innerHeight)
      if (context !== window) {
        context.scrollTop = getPosition(start, end, elapsed, duration, ease)
      } else {
        window.scroll(0, getPosition(start, end, elapsed, duration, ease))
      }

      if (typeof duration === 'undefined' || elapsed > duration) {
        resolve()
        return
      }
      raf(step)
    }
    raf(step)
  })
}
