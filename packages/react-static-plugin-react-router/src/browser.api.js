import React from 'react'
import { BrowserRouter, StaticRouter } from 'react-router-dom'

export default ({ RouterProps: userRouterProps = {} }) => ({
  Router: () => ({ children, basepath, staticInfo }) => {
    let Router
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
    }
    return (
      <Router {...routerProps} {...userRouterProps}>
        <React.Fragment>{children}</React.Fragment>
      </Router>
    )
  },
})
