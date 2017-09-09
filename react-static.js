import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const propsCache = {}

export const GetRouteProps = (Comp, options = {}) =>
  class AsyncPropsComponent extends Component {
    static contextTypes = {
      router: PropTypes.object,
      initialProps: PropTypes.object,
    }
    state = { data: null }
    async componentWillMount () {
      if (typeof window !== 'undefined') {
        const url = `${this.context.router.route.match.url}/initialProps.json`
        // Hit the cache first
        if (propsCache[url]) {
          return this.setState({
            data: propsCache[url],
          })
        }

        // Then try for the embedded data
        if (window.__routeInfo.path === this.context.router.route.match.url) {
          propsCache[url] = window.__routeInfo.initialProps
          this.setState({
            data: propsCache[url],
          })
          return
        }

        // Then retrieve async
        const { data } = await axios.get(url)
        propsCache[url] = data
        this.setState({
          data,
        })
      }
    }
    render () {
      const initialProps = this.context.initialProps || this.state.data
      if (!initialProps) {
        return options.loading ? <options.loading /> : <span>Loading...</span>
      }
      return <Comp {...this.props} {...initialProps} />
    }
  }
