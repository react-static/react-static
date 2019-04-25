import React from 'react'
import { pathJoin, makePathAbsolute } from '../../utils'

const REGEX_FOR_SCRIPT = /<(\/)?(script)/gi

const generateRouteInformation = embeddedRouteInfo => ({
  __html: `
    window.__routeInfo = ${JSON.stringify(embeddedRouteInfo).replace(
      REGEX_FOR_SCRIPT,
      '<"+"$1$2'
    )};`,
})

// Not only do we pass react-helmet attributes and the app.js here, but
// we also need to  hard code site props and route props into the page to
// prevent flashing when react mounts onto the HTML.
const makeBodyWithMeta = async state => {
  const { head, route, embeddedRouteInfo, clientScripts = [] } = state

  // This embeddedRouteInfo will be inlined into the HTML for this route.
  // It should only include the full props, not the partials.

  return ({ children, ...rest }) => (
    <body {...head.bodyProps} {...rest}>
      {children}
      {!route.redirect ? (
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={generateRouteInformation(embeddedRouteInfo)}
        />
      ) : null}
      {!route.redirect
        ? clientScripts.map(script => (
            <script
              key={script}
              defer
              type="text/javascript"
              src={makePathAbsolute(
                pathJoin(process.env.REACT_STATIC_ASSETS_PATH, script)
              )}
            />
          ))
        : null}
    </body>
  )
}

export default makeBodyWithMeta
