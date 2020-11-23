import * as React from 'react'

function Suspense({ key, children, ...rest }) {
  return typeof document !== 'undefined' ? (
    <React.Suspense key={key} {...rest}>
      {children}
    </React.Suspense>
  ) : (
    <React.Fragment key={key}>{children}</React.Fragment>
  )
}

export default Suspense
