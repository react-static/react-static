import { useEffect, useRef } from 'react'
import RAF from 'raf'
import onLocationChange from '../utils/onLocationChange'
//
import scrollTo from '../utils/scrollTo'

export default function useHashScroller({
  context,
  autoScrollToTop = true,
  autoScrollToHash = true,
  scrollToTopDuration = 0,
  scrollToHashDuration = 800,
  scrollToHashOffset = 0,
}) {
  const scrollToTop = () => {
    if (autoScrollToTop) {
      scrollTo(0, {
        duration: scrollToTopDuration,
        context,
      })
    }
  }

  const scrollToHash = (hash, { orScrollToTop = true } = {}) => {
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
            context,
          })
        } else {
          RAF(() => {
            const element = document.getElementById(resolvedHash)
            if (element !== null) {
              scrollTo(element, {
                duration: scrollToHashDuration,
                offset: scrollToHashOffset,
                context,
              })
            }
          })
        }
      }
    } else if (orScrollToTop) {
      scrollTo(0, {
        duration: scrollToHashDuration,
        context,
      })
    }
  }

  const prevPathnameRef = useRef()

  useEffect(() => {
    const unsubscribe = onLocationChange(({ hash, pathname }) => {
      if (prevPathnameRef.current !== pathname && !hash) {
        scrollToTop()
      } else if (hash) {
        scrollToHash(hash)
      }
      prevPathnameRef.current = pathname
    })

    // Do not scroll to top on initial page load if hash does not exist
    scrollToHash(window.location.hash, { orScrollToTop: false })

    return unsubscribe
  }, [])
}
