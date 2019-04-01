let locationSubscribers = []
const triggerLocationChange = location =>
  locationSubscribers.forEach(s => s(location))
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
      triggerLocationChange(window.location)
    }
    ;['pushState', 'replaceState'].forEach(methodName => {
      const old = window.history[methodName]
      window.history[methodName] = (...args) => {
        setTimeout(() => triggerLocationChange(window.location), 0)
        return old.apply(window.history, args)
      }
    })
  }
}
