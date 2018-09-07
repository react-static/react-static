import React from 'react'
import { Router, Link, Route, Switch } from 'react-static'
import universal from 'react-universal-component'
import { hot } from 'react-hot-loader'
//
import Routes from 'react-static-routes'

import './app.css'

// Use universal-react-component for code-splitting non-static routes :)
const NonStatic = universal(import('./containers/NonStatic'))

const App = () => (
  <Router>
    <div>
      <nav>
        <Link exact to="/">Home</Link>
        <Link to="/non-static">Non-Static Route</Link>
        <Link to="/i-dont-match-any-route">Non-Matching Route</Link>
      </nav>
      <div className="content">
        <Switch>
          <Route path="/non-static" component={NonStatic} />
          <Routes />
        </Switch>
      </div>
    </div>
  </Router>
)

export default hot(module)(App)
