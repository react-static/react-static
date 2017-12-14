import React from 'react'
import { Router, Route, Link } from 'react-static'
import { easeQuadOut } from 'd3-ease'
import { NodeGroup } from 'react-move'
import { withContext, getContext } from 'recompose'
import PropTypes from 'prop-types'
//
import Routes from 'react-static-routes'

import './app.css'

// The magic :)
const AnimatedRoutes = (
  <Routes
    component={getContext({
      // We have to preserve the router context for each route
      // otherwise, a component may rerender with the wrong data
      // during animation
      router: PropTypes.object,
    })(({ getComponentForPath, router }) => (
      <Route
        path="*"
        render={props => {
          // Get the component for this path
          let Comp = getComponentForPath(props.location.pathname)
          if (!Comp) {
            Comp = getComponentForPath('404')
          }

          // Use React-Move to animate the different components coming in and out
          return (
            <NodeGroup
              // React-move will handle the entry and exit of any items we pass in `data`
              data={[
                {
                  // pass the current Comp, props, ID and router
                  id: props.location.pathname,
                  Comp,
                  props,
                  router,
                },
              ]}
              keyAccessor={d => d.id}
              start={() => ({
                opacity: [0],
                scale: 1,
                translateY: [10],
              })}
              enter={() => ({
                opacity: [1],
                translateY: [0],
                timing: { duration: 200, delay: 200, ease: easeQuadOut },
              })}
              update={() => ({
                opacity: [1],
              })}
              leave={() => ({
                opacity: [0],
                translateY: [-10],
                timing: { duration: 200, ease: easeQuadOut },
              })}
            >
              {nodes => (
                <div style={{ position: 'relative' }}>
                  {nodes.map(({ key, data, state: { opacity, translateY } }) => {
                    // Here, we override the router context with the one that was
                    // passed with each route
                    const PreservedRouterContext = withContext(
                      {
                        router: PropTypes.object,
                      },
                      () => ({
                        router: data.router,
                      }),
                    )(props => <div {...props} />)

                    return (
                      <PreservedRouterContext
                        key={key}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0,
                          transform: `translateY(${translateY}px)`,
                          opacity,
                        }}
                      >
                        <data.Comp {...data.props} />
                      </PreservedRouterContext>
                    )
                  })}
                </div>
              )}
            </NodeGroup>
          )
        }}
      />
    ))}
  />
)

export default () => (
  <Router>
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <div className="content">
        <AnimatedRoutes />
      </div>
    </div>
  </Router>
)
