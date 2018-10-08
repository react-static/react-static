import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
//
import DevSpinner from './DevSpinner'

//

let siteDataPromise

export default class SiteData extends React.Component {
  static contextTypes = {
    routeInfo: PropTypes.object,
  }
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
      this.context.routeInfo &&
      this.context.routeInfo.siteData
    ) {
      siteData = this.context.routeInfo && this.context.routeInfo.siteData
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

export function withSiteData(Comp) {
  return function ConnectedSiteData(props) {
    return <SiteData component={Comp} {...props} />
  }
}
