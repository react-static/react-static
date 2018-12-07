if (typeof document !== 'undefined') {
  // Polyfill that shiz!
  require('intersection-observer')

  // Do manual polling for intersections every second. This isn't very fast
  // but should handle most edge cases for now
  IntersectionObserver.POLL_INTERVAL = 1000
}

const list = new Map()

export default function onVisible(element, callback) {
  if (list.get(element)) {
    return
  }
  const io = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Edge doesn't support isIntersecting. intersectionRatio > 0 works as a fallback
      if (
        element === entry.target &&
        (entry.isIntersecting || entry.intersectionRatio > 0)
      ) {
        io.unobserve(element)
        io.disconnect()

        callback()
      }
    })
  })
  io.observe(element)
  list.set(element, true)
}
