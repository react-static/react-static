import { useState, useEffect } from 'react'
import axios from 'axios'
//
import { onReloadClientData } from '..'
import { useStaticInfo } from './useStaticInfo'

// This will likely become a react cache resource soon
let siteDataPromise
let siteDataReady
let siteData

const useSiteData = () => {
  // When clientData reloads, rerender components
  // that use this hook
  // eslint-disable-next-line
  const [_, setCount] = useState(0)
  useEffect(() =>
    onReloadClientData(() => {
      siteDataPromise = null
      siteDataReady = false
      setCount(old => old + 1)
    })
  )

  const staticInfo = useStaticInfo()

  if (staticInfo) {
    return staticInfo.siteData
  }

  if (siteDataReady) {
    return siteData
  }

  if (!siteDataPromise) {
    // Request the site data
    siteDataPromise = axios
      .get('/__react-static__/siteData')
      .then(({ data }) => {
        siteDataReady = true
        siteData = data
      })
  }

  // Throw the promise
  throw siteDataPromise
}

export default useSiteData
