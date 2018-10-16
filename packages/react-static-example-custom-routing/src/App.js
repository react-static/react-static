import React from 'react'
import { Root, Route, Switch, Link } from 'react-static'

//
import Home from 'containers/Home'
import About from 'containers/About'
import Blog from 'containers/Blog'
import NotFound from 'containers/404'

import './app.css'

const App = () => (
  <Root>
    <div>
      <nav>
        <Link exact to="/">
          Home
        </Link>
        <Link to="/about/">About</Link>
        <Link to="/blog/">Blog</Link>
      </nav>
      <div className="content">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="about" component={About} />
          <Route path="blog" component={Blog} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  </Root>
)

export default App
