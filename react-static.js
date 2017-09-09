import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const propsCache = {}

export const GetRouteProps = selector => (Comp, options = {}) =>
  class AsyncPropsComponent extends Component {
    static contextTypes = {
      router: PropTypes.object,
      initialProps: PropTypes.object,
    }
    state = { loading: true, data: null }
    async componentWillMount () {
      if (global.window) {
        const url = `${this.context.router.route.match.url}/initialProps.json`
        if (propsCache[url]) {
          return this.setState({
            loading: false,
            data: propsCache[url],
          })
        }

        this.setState({
          loading: true,
        })
        const { data } = await axios.get(url)
        propsCache[url] = data
        this.setState({
          loading: false,
          data,
        })
      }
    }
    getInitialProps () {
      return selector(this.props)
    }
    render () {
      const initialProps = this.context.initialProps || this.state.data
      if (this.state.loading) {
        return options.loading ? <options.loading /> : <span>Loading...</span>
      }
      return initialProps ? <Comp {...this.props} {...initialProps} /> : null
    }
  }
