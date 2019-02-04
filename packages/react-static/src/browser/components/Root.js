import React from 'react'
import { Router as ReachRouter, ServerLocation } from '@reach/router'
//
import {
  routeInfoByPath,
  sharedDataByHash,
  registerTemplateForPath,
  plugins,
} from '../'
import { getBasePath, makePathAbsolute, makeHookReducer } from '../utils'
import ErrorBoundary from './ErrorBoundary'
import HashScroller from './HashScroller'
import { withStaticInfo } from './StaticInfo'

const DefaultPath = ({ render }) => render

const DefaultRouter = ({ children, basepath, staticInfo }) => {
  children = (
    <ReachRouter basepath={basepath}>
      <DefaultPath default render={children} />
    </ReachRouter>
  )
  return typeof document === 'undefined' ? (
    <ServerLocation url={makePathAbsolute(staticInfo.path)}>
      {children}
    </ServerLocation>
  ) : (
    children
  )
}

const RouterHook = makeHookReducer(plugins, 'Router', { sync: true })
const ResolvedRouter = RouterHook(DefaultRouter)

const Root = withStaticInfo(
  class Root extends React.Component {
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
        const { path, sharedData, sharedHashesByProp, template } = staticInfo

        // Hydrate routeInfoByPath with the embedded routeInfo
        routeInfoByPath[path] = staticInfo

        // Hydrate sharedDataByHash with the embedded routeInfo
        Object.keys(sharedHashesByProp).forEach(propKey => {
          sharedDataByHash[sharedHashesByProp[propKey]] = sharedData[propKey]
        })

        // In SRR and production, synchronously register the template for the
        // initial path
        registerTemplateForPath(path, template)
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

      return (
        <ErrorBoundary>
          <Wrapper>
            <ResolvedRouter basepath={basepath} staticInfo={staticInfo}>
              {children}
            </ResolvedRouter>
          </Wrapper>
        </ErrorBoundary>
      )
    }
  }
)

export default Root
