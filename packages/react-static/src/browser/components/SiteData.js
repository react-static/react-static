import React from 'react'
import axios from 'axios'
//
import Spinner from './Spinner'
import { withStaticInfo } from './StaticInfo'

// Share a single promise for all siteData requests
let siteDataPromise

const SiteData = withStaticInfo(
  class SiteData extends React.Component {
    static defaultProps = {
      Loader: Spinner,
    }
    constructor(props) {
      super(props)

      const { staticInfo } = this.props

      this.state = {
        // Default siteData to use the staticInfo if possible
        // This will be undefined in development, which will
        // then be requested at runtime.
        siteData: staticInfo ? staticInfo.siteData : null,
      }
    }
    componentDidMount() {
      this.fetchSiteData()
    }
    componentWillUnmount() {
      this.unmounted = true
    }
    safeSetState = (...args) => {
      if (this.unmounted) {
        return
      }
      this.setState(...args)
    }
    fetchSiteData = async () => {
      // We only fetch siteData in development. Normally
      // it is already embedded in the HTML.
      if (process.env.REACT_STATIC_ENV === 'development') {
        // If there is an error here, it should be caught
        // by the nearest React ErrorBoundary
        const { data: siteData } = await (() => {
          if (siteDataPromise) {
            return siteDataPromise
          }
          siteDataPromise = axios.get('/__react-static__/siteData')
          return siteDataPromise
        })()
        this.safeSetState({ siteData })
      }
    }
    render() {
      const { children, Loader } = this.props
      const { siteData, siteDataError } = this.state

      // If there was a fetch error in dev, throw it to the nearest ErrorBoundary
      if (siteDataError) {
        throw siteDataError
      }

      if (!siteData) {
        return <Loader />
      }

      return children(siteData)
    }
  }
)

export default SiteData

export function withSiteData(Comp, opts = {}) {
  return props => (
    <SiteData {...opts}>
      {siteData => <Comp {...siteData} {...props} />}
    </SiteData>
  )
}
