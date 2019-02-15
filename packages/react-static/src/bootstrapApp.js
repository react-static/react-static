/* eslint-disable import/no-dynamic-require */
import React from 'react'
import { staticInfoContext } from './browser/hooks/useStaticInfo'

const App = require(`${process.env.REACT_STATIC_ENTRY_PATH}`).default

export default staticInfo => props => (
  <staticInfoContext.Provider value={staticInfo}>
    <App {...props} />
  </staticInfoContext.Provider>
)
