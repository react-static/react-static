import React from 'react'
import { extractStyles } from 'evergreen-ui'

export default () => ({
  headElements: elements => {
    const { css, hydrationScript } = extractStyles()
    return [
      ...elements,
      <style id="evergreen-css" dangerouslySetInnerHTML={{ __html: css }} />,
      hydrationScript,
    ]
  },
})
