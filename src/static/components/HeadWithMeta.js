import React from 'react'
import { isAbsoluteUrl, cleanSlashes, trimTrailingSlashes } from '../../utils/shared'

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

export const makeHeadWithMeta = ({
  head,
  route,
  clientScripts,
  config,
  clientStyleSheets,
  clientCss,
}) => ({ children, ...rest }) => {
  const renderLinkCSS = !route.redirect && !config.inlineCss
  const useHelmetTitle = head.title && head.title[0] && head.title[0].props.children !== ''
  let childrenArray = children
  if (useHelmetTitle) {
    head.title[0] = React.cloneElement(head.title[0], { key: 'title' })
    childrenArray = React.Children.toArray(children).filter(child => {
      if (child.type === 'title') {
        // Filter out the title of the Document in static.config.js
        // if there is a helmet title on this route
        return false
      }
      return true
    })
  }

  const assetsPath = isAbsoluteUrl(process.env.REACT_STATIC_ASSETS_PATH)
    ? trimTrailingSlashes(process.env.REACT_STATIC_ASSETS_PATH)
    : `/${cleanSlashes(process.env.REACT_STATIC_ASSETS_PATH)}`

  return (
    <head {...rest}>
      {head.base}
      {useHelmetTitle && head.title}
      {head.meta}
      {!route.redirect &&
        clientScripts.map(script => (
          <link
            key={`clientScript_${script}`}
            rel="preload"
            as="script"
            href={`${assetsPath}/${script}`}
          />
        ))}
      {renderLinkCSS &&
        clientStyleSheets.reduce(
          (memo, styleSheet) => [
            ...memo,
            <link
              key={`clientStyleSheetPreload_${styleSheet}`}
              rel="preload"
              as="style"
              href={`${assetsPath}/${styleSheet}`}
            />,
            <link
              key={`clientStyleSheet_${styleSheet}`}
              rel="stylesheet"
              href={`${assetsPath}/${styleSheet}`}
            />,
          ],
          []
        )}
      {head.link}
      {head.noscript}
      {head.script}
      {config.inlineCss && <InlineStyle clientCss={clientCss} />}
      {head.style}
      {childrenArray}
    </head>
  )
}
