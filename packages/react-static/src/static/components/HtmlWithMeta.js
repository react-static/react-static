import React from 'react'
import plugins from '../plugins'

// Instead of using the default components, we need to hard code meta
// from react-helmet into the components
const makeHtmlWithMeta = async state => {
  const { head } = state

  const htmlProps = await plugins.htmlProps(head.htmlProps, state)

  return ({ children, ...rest }) => (
    <html lang="en" {...htmlProps} {...rest}>
      {children}
    </html>
  )
}

export default makeHtmlWithMeta
