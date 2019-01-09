# Dynamic Routes with React Router

- [Install React Router (react-router-dom)](https://reacttraining.com/react-router/web/guides/quick-start)
- Install the [react-static-plugin-react-router](/packages/react-static-plugin-react-router)
- Configure React Router to
  - Handle dynamic routes
  - Fall back to rendering static routes

```javascript
import React from 'react'
import { Root, Routes } from 'react-static'
import { Switch, Route, Link } from 'react-router-dom'

import './app.css'

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
        <Switch>
          <Route path="/dynamic" component={Dynamic} />
          <Route render={() => <Routes />} />
        </Switch>
      </div>
    </Root>
  )
}

export default App
```

> **NOTE:** No `html` file is exported for dynamic routes at build time, which means the server won't have a file to serve when those routes are requested as the first entry point into your site. If you have a site with a lot of dynamic data, you may not want to flash the `404.html` template on dynamic routes, or you may want to make a dynamic app shell or other server-side solution to make this smoother. One simple (but naive) way to do this is to make your 404 route only render after mount. An example of this is shown here:

```javascript
export default class extends React.Component {
  state = {
    ready: false,
  }
  componentDidMount() {
    this.makeReady()
  }
  makeReady = () => {
    if (!this.state.ready) {
      this.setState({
        ready: true,
      })
    }
  }
  render() {
    return this.state.ready ? (
      <div>
        <h1>404 - Oh no's! We couldn't find that page :(</h1>
      </div>
    ) : null
  }
}
```
