import React from 'react'
import { Router, Link } from 'react-static'
import glamorous from 'glamorous'

//
import Routes from 'react-static-routes'

import './app.css'

const AppStyles = glamorous.div({
  fontFamily:
    "'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  fontSize: '16px',
  margin: '0',
  padding: '0',
  '& a': {
    textDecoration: 'none',
    color: '#108db8',
    fontWeight: 'bold',
  },
  '& nav': {
    width: '100%',
    background: '#108db8',
    '& a': {
      color: 'white',
      padding: '1rem',
      display: 'inline-block',
    },
  },
  '& .content': {
    padding: '1rem',
  },
})

const App = () => (
  <Router>
    <AppStyles>
      <nav>
        <Link exact to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <div className="content">
        <Routes />
      </div>
    </AppStyles>
  </Router>
)

export default App
