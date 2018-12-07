import React from 'react'
import RAF from 'raf'
import onLocationChange from '../utils/Location'
//
import scrollTo from '../utils/scrollTo'

export default class RouterScroller extends React.Component {
  componentDidMount() {
    // Do not scroll to top on initial page load if hash does not exist
    this.scrollToHash(window.location.hash, { orScrollToTop: false })

    onLocationChange(({ hash, pathname }) => {
      if (this.prevPathname !== pathname && !hash) {
        this.scrollToTop()
      } else if (this.prevHash !== hash) {
        this.scrollToHash(hash)
      }
      this.prevPathname = pathname
      this.prevHash = hash
    })
  }
  scrollToTop = () => {
    const { autoScrollToTop, scrollToTopDuration } = this.props
    if (autoScrollToTop) {
      scrollTo(0, {
        duration: scrollToTopDuration,
      })
    }
  }
  scrollToHash = (hash, { orScrollToTop = true } = {}) => {
    const {
      scrollToHashDuration,
      autoScrollToHash,
      scrollToHashOffset,
    } = this.props
    if (!autoScrollToHash) {
      return
    }
    if (hash) {
      const resolvedHash = hash.substring(1)
      if (resolvedHash) {
        // We must attempt to scroll synchronously or we risk the browser scrolling for us
        const element = document.getElementById(resolvedHash)
        if (element !== null) {
          scrollTo(element, {
            duration: scrollToHashDuration,
            offset: scrollToHashOffset,
          })
        } else {
          RAF(() => {
            const element = document.getElementById(resolvedHash)
            if (element !== null) {
              scrollTo(element, {
                duration: scrollToHashDuration,
                offset: scrollToHashOffset,
              })
            }
          })
        }
      }
    } else if (orScrollToTop) {
      scrollTo(0, {
        duration: scrollToHashDuration,
      })
    }
  }
  render() {
    console.log(this.props.location)
    return this.props.children
  }
}
