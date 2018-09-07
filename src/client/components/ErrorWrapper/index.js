import React from 'react'
import PropTypes from 'prop-types'
import ErrorCatcher from './ErrorCatcher'

const ErrorWrapper = ({ showErrorsInProduction, children }) => {
  if (process.env.REACT_STATIC_ENV === 'development' || showErrorsInProduction) {
    return <ErrorCatcher>{children}</ErrorCatcher>
  }

  return React.Children.only(children)
}

ErrorWrapper.propTypes = {
  showErrorsInProduction: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

ErrorWrapper.defaultProps = {
  showErrorsInProduction: false,
}

export default ErrorWrapper
