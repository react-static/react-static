import React from 'react'
import PropTypes from 'prop-types'

const ErrorUI = ({ error, errorInfo }) => (
  <div
    style={{
      margin: '1rem',
      padding: '1rem',
      background: 'rgba(0,0,0,0.05)',
    }}
  >
    <h2>Oh-no! Something’s gone wrong!</h2>
    <pre style={{ whiteSpace: 'normal', color: 'red' }}>
      <code>{error && error.toString()}</code>
    </pre>
    <h3>This error occurred here:</h3>
    <pre style={{ color: 'red', overflow: 'auto' }}>
      <code>{errorInfo.componentStack}</code>
    </pre>
    <p>For more information, please see the console.</p>
  </div>
)

ErrorUI.propTypes = {
  error: PropTypes.object.isRequired,
  errorInfo: PropTypes.object.isRequired,
}

export default ErrorUI
