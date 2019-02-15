import React from 'react'
import { useBasepath, useStaticInfo, makePathAbsolute } from 'react-static'
import { Router, ServerLocation } from '@reach/router'

const DefaultPath = ({ render }) => render

export default ({ RouterProps: userRouterProps = {} }) => ({
  Root: PreviousRoot => ({ children }) => {
    const basepath = useBasepath()
    const staticInfo = useStaticInfo()

    children = (
      <Router {...userRouterProps} basepath={basepath}>
        <DefaultPath default render={<PreviousRoot>{children}</PreviousRoot>} />
      </Router>
    )

    return typeof document === 'undefined' ? (
      <ServerLocation url={makePathAbsolute(staticInfo.path)}>
        {children}
      </ServerLocation>
    ) : (
      children
    )
  },
})
