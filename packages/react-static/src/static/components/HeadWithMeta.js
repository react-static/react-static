import React from 'react'
//
import { pathJoin, makePathAbsolute } from '../../utils'
import plugins from '../plugins'
// import packagejson from '../../../package.json'

// const { version } = packagejson

const REGEX_FOR_STYLE_TAG = /<style>|<\/style>/gi

export const InlineStyle = ({ clientCss }) => (
  <style
    key="clientCss"
    type="text/css"
    dangerouslySetInnerHTML={{
      __html: clientCss.toString().replace(REGEX_FOR_STYLE_TAG, ''),
    }}
  />
)

export default async function makeHeadWithMeta(state) {
  const {
    head,
    route,
    clientScripts,
    config,
    clientStyleSheets,
    clientCss,
  } = state

  const pluginHeads = await plugins.headElements([], state)

  return ({ children, ...rest }) => {
    const renderLinkCSS = !route.redirect && !config.inlineCss

    const useHelmetTitle =
      head.title && head.title[0] && head.title[0].props.children !== ''

    let childrenArray = React.Children.toArray(children)

    if (useHelmetTitle) {
      head.title[0] = React.cloneElement(head.title[0], { key: 'title' })
      childrenArray = childrenArray.filter(child => {
        if (child.type === 'title') {
          // Filter out the title of the Document in static.config.js
          // if there is a helmet title on this route
          return false
        }
        return true
      })
    }

    const childrenCSS = childrenArray.filter(child => {
      if (
        child.type === 'link' &&
        child.props &&
        child.props.rel === 'stylesheet'
      ) {
        return true
      } if (child.type === 'style') {
        return true
      }
      return false
    })

    const childrenJS = childrenArray.filter(child => child.type === 'script')
    childrenArray = childrenArray.filter(child => {
      if (
        child.type === 'link' &&
        child.props &&
        child.props.rel === 'stylesheet'
      ) {
        return false
      } if (child.type === 'style') {
        return false
      } if (child.type === 'script') {
        return false
      }
      return true
    })

    return (
      <head {...rest}>
        <meta name="generator" content="React Static" />
        {head.base}
        {useHelmetTitle && head.title}
        {head.meta}
        {childrenJS}
        {!route.redirect &&
          clientScripts.map(script => (
            <link
              key={`clientScript_${script}`}
              rel="preload"
              as="script"
              href={makePathAbsolute(
                pathJoin(process.env.REACT_STATIC_ASSETS_PATH, script)
              )}
            />
          ))}
        {childrenCSS}
        {renderLinkCSS &&
          clientStyleSheets.reduce((memo, styleSheet) => {
            const href = makePathAbsolute(
              pathJoin(process.env.REACT_STATIC_ASSETS_PATH, styleSheet)
            )

            return [
              ...memo,
              <link
                key={`clientStyleSheetPreload_${styleSheet}`}
                rel="preload"
                as="style"
                href={href}
              />,
              <link
                key={`clientStyleSheet_${styleSheet}`}
                rel="stylesheet"
                href={href}
              />,
            ]
          }, [])}
        {head.link}
        {head.noscript}
        {head.script}
        {config.inlineCss && <InlineStyle clientCss={clientCss} />}
        {head.style}
        {pluginHeads}
        {childrenArray}
      </head>
    )
  }
}
