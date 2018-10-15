const config = { attributes: true, childList: true, subtree: true }

let subscribers = []
const trigger = (...args) => subscribers.forEach(s => s(...args))

export default function onMutation(cb) {
  subscribers.push(cb)
  return () => {
    subscribers = subscribers.filter(d => d !== cb)
  }
}

if (typeof document !== 'undefined') {
  // Polyfill that shiz!
  require('mutation-observer')

  // Create an observer instance linked to the callback function
  const observer = new window.MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        return [].slice.call(mutation.addedNodes).map(trigger)
      }
      return trigger(mutation.target)
    })
  })
  observer.observe(document, config)
}
