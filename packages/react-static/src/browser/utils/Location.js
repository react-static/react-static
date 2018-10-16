let locationSubscribers = []
const triggerLocationChange = () => locationSubscribers.forEach(s => s())
const onLocationChange = cb => {
  locationSubscribers.push(cb)
  return () => {
    locationSubscribers = locationSubscribers.filter(d => d !== cb)
  }
}

init()

export default onLocationChange

function init() {
  if (typeof document !== 'undefined') {
    const oldPopstate = window.onpopstate
    window.onpopstate = (...args) => {
      if (oldPopstate) {
        oldPopstate(...args)
      }
      triggerLocationChange()
    }
    ;['pushState', 'replaceState'].forEach(methodName => {
      const old = window.history[methodName]
      window.history[methodName] = (...args) => {
        triggerLocationChange()
        return old.apply(window.history, args)
      }
    })
  }
}
