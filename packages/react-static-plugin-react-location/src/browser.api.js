import React, { useState } from 'react'
import { useBasepath, useStaticInfo, makePathAbsolute } from 'react-static'
import {
  LocationProvider,
  useLocation,
  createMemorySource,
  createHistory,
} from 'react-location'

export default ({ RouterProps: userRouterProps = {} }) => ({
  Root: PreviousRoot => ({ children, ...rest }) => {
    const basepath = useBasepath()
    const staticInfo = useStaticInfo()

    const [history] = useState(() => {
      if (typeof document !== 'undefined') {
        return createHistory(window)
      }
      const source = createMemorySource(makePathAbsolute(staticInfo.path))
      return createHistory(source)
    })

    return (
      <LocationProvider
        history={history}
        basepath={basepath}
        {...userRouterProps}
      >
        <PreviousRoot {...rest}>{children}</PreviousRoot>
      </LocationProvider>
    )
  },
  Routes: PreviousRoutes => props => {
    const location = useLocation()
    return (
      // Wrap Routes in a reach router
      <PreviousRoutes location={location} {...props} />
    )
  },
})
