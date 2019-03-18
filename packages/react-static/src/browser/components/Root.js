import React from 'react'
//
import { plugins } from '../'
import { makeHookReducer } from '../utils'

export const Root = ({ children }) => {
  const ResolvedRoot = React.useMemo(() => {
    const RootHook = makeHookReducer(plugins, 'Root', { sync: true })
    return RootHook(({ children }) => children)
  }, [plugins])

  return <ResolvedRoot>{children}</ResolvedRoot>
}
