import React from 'react'
import JssProvider from 'react-jss/lib/JssProvider'
import { SheetsRegistry } from 'react-jss/lib/jss'

export default ({ providerProps = {} }) => ({
  // NOTE: This whole process could likely be extracted into a reusable
  // react-static-plugin-jss plugin. Thoughts?

  beforeRenderToElement: (App, { meta }) => props => {
    // Create a sheetsRegistry instance.
    meta.jssSheetsRegistry = new SheetsRegistry()

    // TODO we could actually add the style removal here too in a compoenntDidMount:
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
