import React from 'react'
import { useBasepath, useStaticInfo, makePathAbsolute } from 'react-static'
import { Router, ServerLocation } from '@reach/router'

export default ({ RouterProps: userRouterProps = {} }) => ({
  Root: PreviousRoot => ({ children, ...rest }) => {
    const Render = ({ render, ...rest }) => render(rest)
    const basepath = useBasepath()
    const staticInfo = useStaticInfo()

    const renderedChildren = (
      // Place a top-level router inside the root
      // This will give proper context to Link and other reach components
      <Router {...(basepath ? { basepath } : {})} {...userRouterProps}>
        <Render
          path="/*"
          render={location =>
            console.log({ location }) || (
              <PreviousRoot {...rest}>{children}</PreviousRoot>
            )
          }
        />
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
    // Wrap Routes in a reach router
    <Router>
      <PreviousRoutes path="/*" {...props} />} />
    </Router>
  ),
})
