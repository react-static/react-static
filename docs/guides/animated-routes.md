# Animated Routes

Animated Routes can be achieved so many different ways. In this example, we'll stick to something simple and use the `react-spring` package.

- Install the `react-spring` module using npm or yarn
- Use the `Routes` component's child-as-a-function api to animate between routes:

```javascript
import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'
import { Transition } from 'react-spring'

const App = () => (
  <Root>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/blog">Blog</Link>
    </nav>
    <div className="content">
      <Routes>
        {({ routePath, getComponentForPath }) => {
          // Using the routePath as the key, both routes will render at the same time for the transition
          const Comp = getComponentForPath(routePath)
          // Get the
          return (
            <Transition
              native
              keys={routePath}
              from={{ transform: 'translateY(100px)', opacity: 0 }}
              enter={{ transform: 'translateY(0px)', opacity: 1 }}
              leave={{ transform: 'translateY(100px)', opacity: 0 }}
            >
              {style => <Comp style={style} />}
            </Transition>
          )
        }}
      </Routes>
    </div>
  </Root>
)

export default App
```
