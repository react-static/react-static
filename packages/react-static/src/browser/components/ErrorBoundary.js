import React from 'react'

import { unwrapArray } from '../utils'

export default class ErrorBoundary extends React.Component {
  state = {
    error: false,
    info: false,
  }
  componentDidCatch(error, info) {
    if (typeof document === 'undefined') {
      throw error
    }
    this.setState({ error, info })
  }
  render() {
    const { error, info } = this.state
    if (this.state.error) {
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
          <button
            size="s"
            onClick={() =>
              this.setState({
                error: false,
                info: false,
              })
            }
          >
            Reload Component
          </button>
          <br />
          <pre style={{ whiteSpace: 'normal', color: 'red' }}>
            <code>{error && error.toString()}</code>
          </pre>
          <pre style={{ color: 'red', overflow: 'auto' }}>
            <code>{info.componentStack}</code>
          </pre>
        </div>
      )
    }
    return unwrapArray(this.props.children)
  }
}
