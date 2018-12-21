import React from 'react'
import { Router as ReachRouter } from '@reach/router'

//
import { routeInfoByPath, sharedDataByHash, registerTemplateForPath } from '../'
import { getBasePath } from '../utils'
import ErrorBoundary from './ErrorBoundary'
import HashScroller from './HashScroller'
import { withStaticInfo } from './StaticInfo'

// If we're in SSR, set the ServerLocation
// if (isSSR()) {
//   routePath = getCurrentRoutePath()
//   Wrapper = ({ children }) => (
//     <ServerLocation url={routePath}>{children}</ServerLocation>
//   )
// }

const DefaultPath = ({ render }) => render

const DefaultRouter = ({ children, ...rest }) => (
  <ReachRouter {...rest}>
    <DefaultPath default render={children} />
  </ReachRouter>
)

const Root = withStaticInfo(
  class Router extends React.Component {
    static defaultProps = {
      disableScroller: false, // TODO:v6 document this!
      autoScrollToTop: true,
      autoScrollToHash: true,
      scrollToTopDuration: 0,
      scrollToHashDuration: 800,
      scrollToHashOffset: 0,
    }
    constructor(props) {
      super()
      const { staticInfo } = props
      if (process.env.REACT_STATIC_ENV === 'production' && staticInfo) {
        const {
          path,
          sharedData,
          sharedHashesByProp,
          templateIndex,
        } = staticInfo

        // Hydrate routeInfoByPath with the embedded routeInfo
        routeInfoByPath[path] = staticInfo

        // Hydrate sharedDataByHash with the embedded routeInfo
        Object.keys(sharedHashesByProp).forEach(propKey => {
          sharedDataByHash[sharedHashesByProp[propKey]] = sharedData[propKey]
        })

        // In SRR and production, synchronously register the templateIndex for the
        // initial path
        registerTemplateForPath(path, templateIndex)
      }
    }
    render() {
      const {
        children,
        disableScroller,
        autoScrollToTop,
        autoScrollToHash,
        scrollToTopDuration,
        scrollToHashDuration,
        scrollToHashOffset,
        staticInfo,
        ...rest
      } = this.props

      const scrollerProps = {
        autoScrollToTop,
        autoScrollToHash,
        scrollToTopDuration,
        scrollToHashDuration,
        scrollToHashOffset,
      }

      let Wrapper = ({ children }) => children

      const basepath = getBasePath()

      // Add the scroller if not disabled
      if (!disableScroller) {
        Wrapper = ({ children }) => (
          <HashScroller {...scrollerProps}>{children}</HashScroller>
        )
      }

      // TODO:v6 Document how to replace the root router (and apply basepath)
      // I'm not sure why you would want to do this, but it's general
      // inversion of control and I feel safer exposing it rather than
      // making it non-configurable
      const renderProps = {
        basepath,
        ...rest,
      }

      // Either use the child as a function, or our default router with children
      const renderedChildren =
        typeof children === 'function' ? (
          children(renderProps)
        ) : (
          <DefaultRouter {...renderProps}>{children}</DefaultRouter>
        )

      return (
        <ErrorBoundary>
          <Wrapper>{renderedChildren}</Wrapper>
        </ErrorBoundary>
      )
    }
  }
)

export default Root
