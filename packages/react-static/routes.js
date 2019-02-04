module.exports = function() {
  throw new Error(
    'Could not load React-Static routes! Please double check your webpack configuration for consistency and restart/rebuild your app. If this error persists, it is likely a webpack resolve.alias problem and you should file an issue at "https://github.com/nozzle/react-static/issues" ASAP.'
  )
}
