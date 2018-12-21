# Dynamic Routes with Reach Router

- [Install Reach Router](https://reach.tech/router)
- Use Reach Router to handle dynamic routs, and fallback to displaying static routes

```javascript
import React from 'react'
import { Root, Routes } from 'react-static'
import { Router, Link } from '@reach/router'

const Dynamic = () => <div>This is a dynamic route!</div>

function App() {
  return (
    <Root>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/dynamic">Dynamic</Link>
      </nav>
      <div className="content">
        <Router>
          <Dynamic path="/dynamic/*" />
          <Routes default />
        </Router>
      </div>
    </Root>
  )
}

export default App
```
