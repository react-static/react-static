import axios from 'axios'
//
import { useStaticInfo } from './useStaticInfo'

// This will likely become a react cache resource soon
let siteDataPromise
let siteDataReady
let siteData

export const useSiteData = () => {
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
