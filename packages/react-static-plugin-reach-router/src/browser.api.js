import React from 'react'
import { useBasepath, useStaticInfo, makePathAbsolute } from 'react-static'
import { Router, ServerLocation, Location } from '@reach/router'

export default ({ RouterProps: userRouterProps = {} }) => ({
  Root: PreviousRoot => ({ children, ...rest }) => {
    const basepath = useBasepath()
    const staticInfo = useStaticInfo()

    const RouteHandler = props => (
      <PreviousRoot {...rest} {...props}>
        {children}
      </PreviousRoot>
    )

    const renderedChildren = (
      // Place a top-level router inside the root
      // This will give proper context to Link and other reach components
      <Router {...(basepath ? { basepath } : {})} {...userRouterProps}>
        <RouteHandler path="/*" />
      </Router>
    )

    // If we're in SSR, use a manual server location
    return typeof document === 'undefined' ? (
      <ServerLocation url={makePathAbsolute(staticInfo.path)}>
        {renderedChildren}
      </ServerLocation>
    ) : (
      renderedChildren
    )
  },
  Routes: PreviousRoutes => props => (
    // Wrap Routes in location
    <Location>
      {location => <PreviousRoutes path="/*" {...props} location={location} />}
    </Location>
  ),
})
