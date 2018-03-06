import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { prefetch, routeInfoByPath } from '../methods'
import { cleanPath } from '../../utils/shared'
import DevSpinner from './DevSpinner'

const RouteData = withRouter(
  class RouteData extends React.Component {
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
        await prefetch(path)
        if (this.unmounting) {
          return
        }
        this.setState({
          loaded: true,
        })
      })()
    render () {
      const { component, render, children, is404, location: { pathname }, ...rest } = this.props
      const path = cleanPath(is404 ? '404' : pathname)

      let allProps

      // Attempt to get routeInfo from window (first-load on client)
      if (typeof window !== 'undefined' && window.__routeInfo && window.__routeInfo.path === path) {
        allProps = window.__routeInfo.allProps
      }

      // Attempt to get routeInfo from context (SSR)
      if (!allProps && this.context.routeInfo && this.context.routeInfo.allProps) {
        allProps = this.context.routeInfo && this.context.routeInfo.allProps
      } else {
        // Otherwise, get it from the routeInfoByPath (subsequent client side)
        allProps = routeInfoByPath[path] ? routeInfoByPath[path].allProps : allProps
      }

      if (!allProps && this.state.loaded) {
        console.error(
          `Warning: withRouteData could not find any props for route: ${path}. Either you are missing a getData function for this route in your static.config.js or you are using the withRouteData HOC when you don't need to.`
        )
      }

      if (!allProps) {
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
  }
)

export default RouteData

export function withRouteData (Comp) {
  return function ConnectedRouteData (props) {
    return <RouteData component={Comp} {...props} />
  }
}
