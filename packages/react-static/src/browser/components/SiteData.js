import React from 'react'
import axios from 'axios'
//
import { withExportContext } from './ExportContext'
import DevSpinner from './DevSpinner'

//

let siteDataPromise

const SiteData = withExportContext(
  class SiteData extends React.Component {
    state = {
      siteData: false,
    }
    async componentWillMount() {
      if (process.env.REACT_STATIC_ENV === 'development') {
        const { data: siteData } = await (() => {
          if (siteDataPromise) {
            return siteDataPromise
          }
          siteDataPromise = axios.get('/__react-static__/siteData')
          return siteDataPromise
        })()
        if (this.unmounting) {
          return
        }
        this.setState({
          siteData,
        })
      }
    }
    componentWillUnmount() {
      this.unmounting = true
    }
    render() {
      const { component, render, children, ...rest } = this.props
      let siteData

      // Get siteInfo from window
      if (typeof window !== 'undefined') {
        if (window.__routeInfo) {
          siteData = window.__routeInfo.siteData
        }
      }

      // Get siteInfo from context (SSR)
      if (
        !siteData &&
        this.props.exportContext.routeInfo &&
        this.props.exportContext.routeInfo.siteData
      ) {
        siteData =
          this.props.exportContext.routeInfo &&
          this.props.exportContext.routeInfo.siteData
      }

      // Get siteInfo from request
      if (!siteData && this.state.siteData) {
        siteData = this.state.siteData
      }

      if (!siteData) {
        if (process.env.REACT_STATIC_ENV === 'development') {
          return <DevSpinner />
        }
        return null
      }

      const finalProps = {
        ...rest,
        ...siteData,
      }
      if (component) {
        return React.createElement(component, finalProps, children)
      }
      if (render) {
        return render(finalProps)
      }
      return children(finalProps)
    }
  }
)

export default SiteData

export function withSiteData(Comp) {
  return function ConnectedSiteData(props) {
    return <SiteData component={Comp} {...props} />
  }
}
