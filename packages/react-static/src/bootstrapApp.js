/* eslint-disable import/no-dynamic-require */
import * as React from 'react'
import { staticInfoContext } from './browser/hooks/useStaticInfo'
import Suspense from './Suspense'

// Override the suspense module to be our own
// This is expected to break when using preact
// In order to make it work with preact 10, use `patch-package` to remove those 2 lines
// Reference: https://github.com/react-static/react-static/pull/1500
React.Suspense = Suspense
React.default.Suspense = Suspense

const App = require(`${process.env.REACT_STATIC_ENTRY_PATH}`).default

export default staticInfo => props => (
  <staticInfoContext.Provider value={staticInfo}>
    <App {...props} />
  </staticInfoContext.Provider>
)
