import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const GetRouteProps = selector => Comp =>
  class AsyncPropsComponent extends Component {
    static contextTypes = {
      router: PropTypes.object,
      initialProps: PropTypes.object,
    }
    async getInitialProps () {
      return selector(this.props)
    }
    render () {
      const initialProps = this.context.initialProps
      return initialProps ? <Comp {...this.props} {...initialProps} /> : null
    }
  }
