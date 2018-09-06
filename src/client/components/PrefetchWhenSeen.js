import React from 'react'

import { cleanPath } from '../../utils/shared'
import { prefetch } from '../methods'

const ioIsSupported = typeof window !== 'undefined' && 'IntersectionObserver' in window
const handleIntersection = (element, callback) => {
  const io = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Edge doesn't support isIntersecting. intersectionRatio > 0 works as a fallback
      if (element === entry.target && (entry.isIntersecting || entry.intersectionRatio > 0)) {
        io.unobserve(element)
        io.disconnect()
        callback()
      }
    })
  })

  io.observe(element)
}

export default class PrefetchWhenSeen extends React.Component {
  static defaultProps = {
    children: null,
    path: null,
    className: null,
    type: null,
    onLoad: () => {},
  }

  componentDidMount () {
    if (!ioIsSupported) {
      this.runPrefetch()
    }
  }

  runPrefetch = () =>
    (async () => {
      const { path, onLoad, type } = this.props
      const cleanedPath = cleanPath(path)
      const data = await prefetch(cleanedPath, { type })
      onLoad(data, cleanedPath)
    })()

  handleRef = ref => {
    if (ioIsSupported && ref) {
      handleIntersection(ref, this.runPrefetch)
    }
  }

  render () {
    const {
      component, render, children, ...rest
    } = this.props
    if (component) {
      return React.createElement(component, {
        handleRef: this.handleRef,
      })
    }
    if (render) {
      return render({ handleRef: this.handleRef })
    }
    return (
      <div ref={this.handleRef} {...rest}>
        {children}
      </div>
    )
  }
}
