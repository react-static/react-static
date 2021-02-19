import * as React from 'react'

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

export default Suspense
