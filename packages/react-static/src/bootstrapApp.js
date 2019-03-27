/* eslint-disable import/no-dynamic-require */
import * as React from 'react'
import { staticInfoContext } from './browser/hooks/useStaticInfo'

const OriginalSuspense = React.Suspense

function Suspense({ key, children, ...rest }) {
  return typeof document !== 'undefined' ? (
    <OriginalSuspense key={key} {...rest}>
      {children}
    </OriginalSuspense>
  ) : (
    <React.Fragment key={key}>{children}</React.Fragment>
  )
}

// Override the suspense module to be our own
React.Suspense = Suspense
React.default.Suspense = Suspense

const App = require(`${process.env.REACT_STATIC_ENTRY_PATH}`).default

export default staticInfo => props => (
  <staticInfoContext.Provider value={staticInfo}>
    <App {...props} />
  </staticInfoContext.Provider>
)
