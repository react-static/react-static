import React, { useContext } from 'react'

// eslint-disable-next-line
let context = React.createContext({})

if (typeof document !== 'undefined') {
  context = React.createContext(window.__routeInfo)
}

export const staticInfoContext = context

export const useStaticInfo = () => useContext(context)
