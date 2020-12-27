import React from 'react'
import { JssProvider, SheetsRegistry } from 'react-jss'

export default ({ providerProps = {} }) => ({
  beforeRenderToElement: (App, { meta }) => props => {
    // Create a sheetsRegistry instance.
    meta.jssSheetsRegistry = new SheetsRegistry()

    // TODO we could actually add the style removal here too in a componentDidMount:
    // https://github.com/cssinjs/examples/blob/gh-pages/react-ssr/src/client.js
    return (
      <JssProvider {...providerProps} registry={meta.jssSheetsRegistry}>
        <App {...props} />
      </JssProvider>
    )
  },
  headElements: (elements, { meta }) => [
    ...elements,
    <style
      id="jss-server-side"
      dangerouslySetInnerHTML={{ __html: meta.jssSheetsRegistry.toString() }}
    />,
  ],
})
