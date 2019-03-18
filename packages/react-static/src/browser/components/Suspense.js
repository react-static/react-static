import React from 'react'

export default function Suspense(props) {
  return typeof document !== 'undefined' ? (
    <React.Suspense {...props} />
  ) : (
    <React.Fragment>{props.children}</React.Fragment>
  )
}
