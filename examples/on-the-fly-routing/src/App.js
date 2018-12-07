import React from 'react'
import { Root, Switch, Route, Link } from 'react-static'

import './app.css'

const All = props => <h1>{props.data}</h1>

const NoMatch = () => <h1>No Match found, but no blank</h1>

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      dynamicRoutes: [
        { path: '/', name: 'Home', data: 'home' },
        {
          path: '/existingAtBuild',
          name: 'Existing at build',
          data: 'Existing at build',
        },
      ],
    }
  }

  addRoute() {
    const dynRoutes = this.state.dynamicRoutes
    dynRoutes.push({
      path: '/hello',
      name: 'HelloWorld',
      data: 'Surprise ! Am a new route created on the fly :)',
    })
    this.setState({ dynamicRoutes: dynRoutes })
  }

  render() {
    return (
      <Root>
        <div>
          <nav>
            {this.state.dynamicRoutes.map((route, i) => (
              <Link to={route.path} key={i}>
                {route.name}
              </Link>
            ))}
          </nav>
          <div className="content">
            <Switch>
              {this.state.dynamicRoutes.map((route, i) => (
                <Route
                  exact
                  path={route.path}
                  key={i}
                  render={props => <All {...props} data={route.data} />}
                />
              ))}
              <Route component={NoMatch} />
            </Switch>

            <p>Add route on the fly:</p>
            <button onClick={() => this.addRoute()}>
              Add route '/helloworld'
            </button>
          </div>
        </div>
      </Root>
    )
  }
}

export default App
