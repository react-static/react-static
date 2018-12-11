import React from 'react'

// eslint-disable-next-line
let context = React.createContext({})
if (typeof document !== 'undefined') {
  context = React.createContext(window.__routeInfo)
}

export default context
export const withStaticInfo = Comp => props => (
  <context.Consumer>
    {staticInfo => <Comp {...props} staticInfo={staticInfo} />}
  </context.Consumer>
)

export function useStaticInfo() {
  return React.useContext(context)
}
