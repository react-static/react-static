/* eslint-disable import/no-dynamic-require */
import * as React from 'react'
import { staticInfoContext } from './browser/hooks/useStaticInfo'
import Suspense from './Suspense'

// Override the suspense module to be our own
React.Suspense = Suspense
React.default.Suspense = Suspense

const App = require(`${process.env.REACT_STATIC_ENTRY_PATH}`).default

export default staticInfo => props => (
  <staticInfoContext.Provider value={staticInfo}>
    <App {...props} />
  </staticInfoContext.Provider>
)
