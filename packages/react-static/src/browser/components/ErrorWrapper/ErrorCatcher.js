import React from 'react'
import PropTypes from 'prop-types'
import ErrorUI from './ErrorUI'

export default class ErrorCatcher extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  state = {
    error: null,
    errorInfo: null,
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    const { error } = this.state

    // Fallback UI if an error occurs
    if (error) {
      return <ErrorUI {...this.state} />
    }

    return React.Children.only(this.props.children)
  }
}
