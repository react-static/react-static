import React from 'react'

import { unwrapArray } from '../utils'

export default class ErrorBoundary extends React.Component {
  state = {
    error: false,
  }
  componentDidCatch(error) {
    if (typeof document === 'undefined') {
      throw error
    }
    this.setState({ error })
  }
  render() {
    const { error } = this.state
    if (error) {
      return (
        <div
          style={{
            margin: '1rem',
            padding: '1rem',
            background: 'rgba(0,0,0,0.05)',
          }}
        >
          <h2>Oh-no! Something’s gone wrong!</h2>
          <br />
          <button size="s" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )
    }
    return unwrapArray(this.props.children)
  }
}
