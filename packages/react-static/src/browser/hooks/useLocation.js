import { useState, useEffect } from 'react'
import onLocationChange from '../utils/onLocationChange'

export const useLocation = () => {
  const [location, setLocation] = useState()
  // eslint-disable-next-line
  const [_, setCount] = useState(0)
  useEffect(
    () =>
      onLocationChange(location => {
        setLocation(location)
        setCount(old => old + 1)
      }),
    []
  )
  return location
}
