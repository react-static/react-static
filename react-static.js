import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

export const GetRouteProps = selector => Comp =>
  class AsyncPropsComponent extends Component {
    static contextTypes = {
      router: PropTypes.object,
      initialProps: PropTypes.object,
    }
    state = {
      props: null,
    }
    async componentWillMount () {
      if (global.window) {
        const { data } = await axios.get(`${this.context.router.route.match.url}/initialProps.json`)
        this.setState({
          props: data,
        })
      }
    }
    getRouteProps () {
      return selector(this.props)
    }
    render () {
      const initialProps = this.context.initialProps || this.state.props
      return initialProps ? <Comp {...this.props} {...initialProps} /> : null
    }
  }
