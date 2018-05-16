import React from 'react'

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
  let showHelmetTitle = true
  const childrenArray = React.Children.toArray(children).filter(child => {
    if (child.type === 'title') {
      // Filter out the title of the Document in static.config.js
      // if there is a helmet title on this route
      const helmetTitleIsEmpty = head.title[0].props.children === ''
      if (!helmetTitleIsEmpty) {
        return false
      }
      showHelmetTitle = false
    }
    return true
  })

  return (
    <head {...rest}>
      {head.base}
      {showHelmetTitle && head.title}
      {head.meta}
      {!route.redirect &&
        clientScripts.map(script => (
          <link
            key={`clientScript_${script}`}
            rel="preload"
            as="script"
            href={`${config.publicPath}${script}`}
          />
        ))}
      {renderLinkCSS &&
        clientStyleSheets.reduce((memo, styleSheet) => [
          ...memo,
          <link
            key={`clientStyleSheet_${styleSheet}`}
            rel="preload"
            as="style"
            href={`${config.publicPath}${styleSheet}`}
          />,
          <link
            key={`clientStyleSheet_${styleSheet}`}
            rel="stylesheet"
            href={`${config.publicPath}${styleSheet}`}
          />,
        ])}
      {head.link}
      {head.noscript}
      {head.script}
      {config.inlineCss && <InlineStyle clientCss={clientCss} />}
      {head.style}
      {childrenArray}
    </head>
  )
}
