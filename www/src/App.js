import React from 'react'
import { Router, onLoading } from 'react-static'
import styled, { injectGlobal } from 'styled-components'
import { hot } from 'react-hot-loader'
import nprogress from 'nprogress'
import { loadLanguages } from 'reprism'
//
import Routes from 'react-static-routes'

import 'nprogress/nprogress.css'
import 'react-smackdown/themes/smackdown-dark.css'

import jsx from 'reprism/languages/jsx'
import bash from 'reprism/languages/bash'

loadLanguages(jsx, bash)

injectGlobal`
  body {
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    font-size: 16px;
    margin: 0;
    padding: 0;
    line-height: 1.5;
  }
  * {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
  }
  #root {
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: #108db8;
  }

  img {
    max-width: 100%;
  }

  pre, code {
    user-select: text;
  }

  pre {
    font-size: 14px;
    border-radius: 5px;
  }

  code.code-inline {
    background: rgba(0,0,0,.05);
    padding: 2px 5px;
    border-radius: 5px;
    border: 1px solid rgba(0,0,0,.05);
    font-size: .8em;
    line-height: 1.5;
  }

  .react-syntax-highlighter-line-number {
    pointer-events: none;
  }
`

const AppStyles = styled.div`
  min-height: 100vh;
`

class App extends React.Component {
  componentDidMount () {
    onLoading(loading => {
      if (loading) {
        nprogress.start()
      } else {
        nprogress.done()
      }
    })
  }
  render () {
    return (
      <Router>
        <AppStyles>
          <Routes />
        </AppStyles>
      </Router>
    )
  }
}

export default hot(module)(App)
