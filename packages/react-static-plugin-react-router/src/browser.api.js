import React from 'react'
import { useBasepath, useStaticInfo } from 'react-static'
import { BrowserRouter, StaticRouter } from 'react-router-dom'

export default ({ RouterProps: userRouterProps = {} }) => ({
  Root: PreviousRoot => ({ children }) => {
    let Router
    const basepath = useBasepath()
    const staticInfo = useStaticInfo()

    const routerProps = {
      basepath, // Required
    }

    // Test for document to detect the node stage
    if (typeof document !== 'undefined') {
      // If in the browser, just use the browser router
      Router = BrowserRouter
    } else {
      Router = StaticRouter
      routerProps.location = staticInfo.path // Required
      routerProps.context = {} // Required
    }
    return (
      <PreviousRoot>
        <Router {...routerProps} {...userRouterProps}>
          <React.Fragment>{children}</React.Fragment>
        </Router>
      </PreviousRoot>
    )
  },
})
