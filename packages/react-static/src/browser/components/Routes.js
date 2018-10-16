import React, { Component } from 'react'
//
import {
  templatesByPath,
  templateErrorByPath,
  templateUpdated,
  prefetch,
  getCurrentRoutePath,
} from '../'
import { withStaticInfo } from './StaticInfo'
import { getRoutePath, isSSR } from '../utils'
import onLocation from '../utils/Location'
import Spinner from './Spinner'

export default withStaticInfo(
  class Routes extends Component {
    static defaultProps = {
      Loader: Spinner,
    }
    componentDidMount() {
      templateUpdated.cb = () => this.forceUpdate()
      this.offLocationChange = onLocation(() => this.forceUpdate())
    }
    componentWillUnmount() {
      if (this.offLocationChange) this.offLocationChange()
    }
    render() {
      const { children, Loader, staticInfo } = this.props

      const currentRoutePath = isSSR() ? staticInfo.path : getCurrentRoutePath()

      const getComponentForPath = routePath => {
        // Clean the path
        routePath = getRoutePath(routePath)

        // Try and get the component
        let Comp = templatesByPath[routePath]

        // Detect a 404
        let is404 = routePath === '404'

        // Detect a failed template
        if (templateErrorByPath[routePath]) {
          is404 = true
          Comp = templatesByPath['404']
        }

        // Detect an unloaded template
        // TODO:suspense - This will become a suspense resource
        if (!Comp) {
          ;(async () => {
            await Promise.all([
              prefetch(routePath, { priority: true }),
              new Promise(resolve =>
                setTimeout(resolve, process.env.REACT_STATIC_MIN_LOAD_TIME)
              ),
            ])
            this.forceUpdate()
          })()
          return Loader
        }

        return (newProps = {}) =>
          Comp ? (
            <Comp {...newProps} {...(is404 ? { is404: true } : {})} />
          ) : null
      }

      if (children) {
        return children({
          getComponentForPath,
        })
      }

      const Comp = getComponentForPath(currentRoutePath)
      return <Comp />
    }
  }
)
