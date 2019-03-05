import React from 'react'
import { LocationProvider } from 'react-location'

export default () => ({
  Root: PreviousRoot => ({ children }) => (
    <LocationProvider>
      <PreviousRoot>{children}</PreviousRoot>
    </LocationProvider>
  ),
})
