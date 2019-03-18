import React from 'react'

// eslint-disable-next-line
let context = React.createContext({})

if (typeof document !== 'undefined') {
  context = React.createContext(window.__routeInfo)
}

export default context
