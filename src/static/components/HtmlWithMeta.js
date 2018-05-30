import React from 'react'

// Instead of using the default components, we need to hard code meta
// from react-helmet into the components
export const makeHtmlWithMeta = ({ head }) => ({ children, ...rest }) => (
  <html lang="en" {...head.htmlProps} {...rest}>
    {children}
  </html>
)
