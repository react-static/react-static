import React from 'react'

import { getRoutePath } from '../utils'
import { prefetch } from '../'
import onVisible from '../utils/Visibility'

export default class Prefetch extends React.Component {
  static defaultProps = {
    children: null,
    path: null,
    force: false,
    onLoad: () => {},
  }

  componentDidMount() {
    if (this.props.force) {
      this.runPrefetch()
    }
  }

  runPrefetch = () =>
    (async () => {
      const { path, onLoad } = this.props
      const cleanedPath = getRoutePath(path)
      const data = await prefetch(cleanedPath)
      onLoad(data, cleanedPath)
    })()

  handleRef = el => {
    if (!this.props.force && el) {
      onVisible(el, this.runPrefetch)
    }
  }

  render() {
    const { children, ...rest } = this.props
    if (children) {
      return children({ handleRef: this.handleRef })
    }
    return (
      <div ref={this.handleRef} {...rest}>
        {children}
      </div>
    )
  }
}
