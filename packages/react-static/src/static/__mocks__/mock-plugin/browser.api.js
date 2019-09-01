import React from 'react'

export default () => ({
  Root: PreviousRoot => ({ children, ...rest }) => {
    return (
      // A wrapper div around the app Root!
      <div {...rest}>
        <PreviousRoot>{children}</PreviousRoot>
      </div>
    )
  },
})
