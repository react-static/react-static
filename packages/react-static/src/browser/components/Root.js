import React from 'react'
//
import { plugins } from '../'
import { makeHookReducer } from '../utils'
import ErrorBoundary from './ErrorBoundary'
import { useStaticInfo } from '../hooks/useStaticInfo'
import { useBasepath } from '../hooks/useBasepath'
import Spinner from './Spinner'

const RootWrapper = ({ children }) => children

const RootHook = makeHookReducer(plugins, 'Root', { sync: true })
const ResolvedRoot = RootHook(RootWrapper)

export const Root = ({ children }) => {
  const staticInfo = useStaticInfo()
  const basepath = useBasepath()

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<Spinner />}>
        <ResolvedRoot basepath={basepath} staticInfo={staticInfo}>
          {children}
        </ResolvedRoot>
      </React.Suspense>
    </ErrorBoundary>
  )
}
