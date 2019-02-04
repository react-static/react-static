/* eslint-disable import/no-dynamic-require */
import React from 'react'
import StaticInfo from './browser/components/StaticInfo'

const App = require(`${process.env.REACT_STATIC_ENTRY_PATH}`).default

export default staticInfo => props => (
  <StaticInfo.Provider value={staticInfo}>
    <App {...props} />
  </StaticInfo.Provider>
)
