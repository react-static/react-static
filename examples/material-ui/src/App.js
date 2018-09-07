import React, { PureComponent } from 'react'
import { Router, Link } from 'react-static'
import { hot } from 'react-hot-loader'
//
import Routes from 'react-static-routes'

import CssBaseline from 'material-ui/CssBaseline'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import { withStyles } from 'material-ui/styles'

// Custom styles
const styles = {
  '@global': {
    img: {
      maxWidth: '100%',
    },
  },
  appBar: {
    flexWrap: 'wrap',
  },
  tabs: {
    width: '100%',
  },
  content: {
    padding: '1rem',
  },
}

class App extends PureComponent {
  // Remove the server-side injected CSS.
  componentDidMount () {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render () {
    const { classes } = this.props

    return (
      <Router>
        <div className={classes.container}>
          <CssBaseline />
          <AppBar className={classes.appBar} color="default" position="static">
            <nav>
              <Tabs className={classes.tabs} value={false}>
                <Tab component={Link} to="/" label="Home" />
                <Tab component={Link} to="/about" label="About" />
                <Tab component={Link} to="/blog" label="Blog" />
              </Tabs>
            </nav>
          </AppBar>
          <div className={classes.content}>
            <Routes />
          </div>
        </div>
      </Router>
    )
  }
}

const AppWithStyles = withStyles(styles)(App)

export default hot(module)(AppWithStyles)
