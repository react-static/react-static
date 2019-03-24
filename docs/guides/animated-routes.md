# Animated Routes

Animated Routes can be achieved so many different ways. In this example, we'll stick to something simple and use the `react-spring` package.

- Install the `react-spring@7` module using npm or yarn
- Use the `Routes` component's child-as-a-function api to animate between routes:

```javascript
import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'
import { Transition, animated } from 'react-spring'

const App = () => (
  <Root>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/blog">Blog</Link>
    </nav>
    <Routes>
      {({ routePath, getComponentForPath }) => {
        // Using the routePath as the key, both routes will render at the same time for the transition
        return (
          <Transition
            native
            items={routePath}
            from={{ transform: 'translateY(100px)', opacity: 0 }}
            enter={{ transform: 'translateY(0px)', opacity: 1 }}
            leave={{ transform: 'translateY(100px)', opacity: 0 }}
          >
            {item => props => {
              const Comp = getComponentForPath(item)
              return (
                <div className="content" style={{ position: 'absolute' }}>
                  <animated.div style={props}>
                    <Comp />
                  </animated.div>
                </div>
              )
            }}
          </Transition>
        )
      }}
    </Routes>
  </Root>
)

export default App
```
