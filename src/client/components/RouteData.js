import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { prefetch, routeInfoByPath } from '../methods'
import { cleanPath } from '../../utils/shared'
import DevSpinner from './DevSpinner'

const warnedPaths = {}

const RouteData = withRouter(class RouteData extends React.Component {
    static contextTypes = {
      routeInfo: PropTypes.object,
    }
    state = {
      loaded: false,
    }
    componentWillMount () {
      if (process.env.REACT_STATIC_ENV === 'development') {
        this.loadRouteData()
      }
    }
    componentWillReceiveProps (nextProps) {
      if (process.env.REACT_STATIC_ENV === 'development') {
        if (this.props.location.pathname !== nextProps.location.pathname) {
          this.setState({ loaded: false }, this.loadRouteData)
        }
      }
    }
    componentWillUnmount () {
      this.unmounting = true
    }
    loadRouteData = () =>
      (async () => {
        const { is404, location: { pathname } } = this.props
        const path = cleanPath(is404 ? '404' : pathname)
        try {
          await prefetch(path)
          this.setState({ loaded: true })
        } catch (err) {
          this.setState({ loaded: true })
        }
      })()
    render () {
      const {
        component, render, children, location: { pathname }, ...rest
      } = this.props
      let { loaded } = this.state

      const path = cleanPath(rest.is404 ? '404' : pathname)

      let allProps

      // Attempt to get routeInfo from window (first-load on client)
      if (typeof window !== 'undefined' && window.__routeInfo && window.__routeInfo.path === path) {
        loaded = true // Since these are synchronous, override loading to true
        allProps = window.__routeInfo.allProps
      }

      // Attempt to get routeInfo from context (SSR)
      if (!allProps && this.context.routeInfo && this.context.routeInfo.allProps) {
        loaded = true // Override loaded to true
        allProps = this.context.routeInfo && this.context.routeInfo.allProps
      } else if (routeInfoByPath[path]) {
        // Otherwise, get it from the routeInfoByPath (subsequent client side)
        loaded = true // Override loaded to true
        allProps = routeInfoByPath[path].allProps
      }

      if (!allProps && !rest.is404 && !warnedPaths[path]) {
        warnedPaths[path] = true
        console.warn(`RouteData or withRouteData couldn't find any props for path: ${path}. You are either missing a route.getData function or you are relying on RouteData/withRouteData where you don't need to.`)
      }

      if (!loaded) {
        if (process.env.REACT_STATIC_ENV === 'development') {
          return <DevSpinner />
        }
        return null
      }

      const finalProps = {
        ...rest,
        ...allProps,
      }
      if (component) {
        return React.createElement(component, finalProps, children)
      }
      if (render) {
        return render(finalProps)
      }
      return children(finalProps)
    }
})

export default RouteData

export function withRouteData (Comp) {
  return function ConnectedRouteData (props) {
    return <RouteData component={Comp} {...props} />
  }
}
