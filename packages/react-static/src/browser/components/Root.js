import React from 'react'
//
import { plugins } from '../'

export const Root = ({ children }) => {
  const ResolvedRoot = React.useMemo(
    () => plugins.Root(({ children }) => children),
    [plugins]
  )

  return <ResolvedRoot>{children}</ResolvedRoot>
}
