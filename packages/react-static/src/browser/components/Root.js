import React from 'react'
import { Router as ReachRouter, ServerLocation } from '@reach/router'

//
import ErrorBoundary from './ErrorBoundary'
import HashScroller from './HashScroller'
import { getCurrentRoutePath, isSSR, getBasePath } from '../utils'

const DefaultPath = ({ render }) => render

const DefaultRouter = ({ children, ...rest }) => (
  <ReachRouter {...rest}>
    <DefaultPath default render={children} />
  </ReachRouter>
)

export default class Router extends React.Component {
  static defaultProps = {
    disableScroller: false, // TODO:v6 document this!
    autoScrollToTop: true,
    autoScrollToHash: true,
    scrollToTopDuration: 0,
    scrollToHashDuration: 800,
    scrollToHashOffset: 0,
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
    let routePath

    if (isSSR()) {
      routePath = getCurrentRoutePath()
      Wrapper = ({ children }) => (
        <ServerLocation url={routePath}>{children}</ServerLocation>
      )
    }

    const basepath = getBasePath()

    // TODO:v6 Document how to replace the root router (and apply basepath)
    // I'm not sure why you would want to do this, but it's general
    // inversion of control and I feel safer exposing it rather than
    // making it non-configurable
    const renderProps = {
      basepath,
      children: disableScroller ? (
        children
      ) : (
        <HashScroller {...scrollerProps}>{children}</HashScroller>
      ),
      ...rest,
    }

    const renderedChildren =
      typeof children === 'function' ? (
        children(renderProps)
      ) : (
        <DefaultRouter {...renderProps} />
      )

    return (
      <Wrapper>
        <ErrorBoundary>{renderedChildren}</ErrorBoundary>
      </Wrapper>
    )
  }
}
