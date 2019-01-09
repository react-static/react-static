import React from 'react'

// eslint-disable-next-line
let context = React.createContext({})
if (typeof document !== 'undefined') {
  context = React.createContext(window.__routeInfo)
}

export default context

const StaticInfo = ({ children }) => (
  <context.Consumer>{children}</context.Consumer>
)

export const withStaticInfo = Comp => props => (
  <StaticInfo>
    {staticInfo => <Comp {...props} staticInfo={staticInfo} />}
  </StaticInfo>
)

export function useStaticInfo() {
  return React.useContext(context)
}
