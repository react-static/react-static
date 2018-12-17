import React from 'react'
import { Root, Routes } from 'react-static'
import { Link, Route, Switch } from 'react-router'
import universal from 'react-universal-component'

//

import './app.css'

// Use universal-react-component for code-splitting non-static routes :)
const NonStatic = universal(import('./containers/NonStatic'))

const App = () => (
  <Root>
    <div>
      <nav>
        <Link to="/">
          Home
        </Link>
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
  </Root>
)

export default App
