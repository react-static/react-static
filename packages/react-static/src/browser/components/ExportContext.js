import React from 'react'

export const withExportContext = Comp => props => (
  <Comp {...props} exportContext={global.__reactStaticExportContext || {}} />
)
