import React from 'react'

export default function Suspense(props) {
  return typeof document !== 'undefined' ? (
    <React.Suspense fallback="Loading..." {...props} />
  ) : (
    <React.Fragment {...props} />
  )
}
