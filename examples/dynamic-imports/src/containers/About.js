
import React from 'react'
//

const Failed = () => (
  <div style={{ color: 'red' }}>
    <h1>Failed to load the heavy component!</h1>
  </div>
)

const Loading = () => (
  <div style={{ color: 'yellow' }}>
    <h1>Loading this heavy component...</h1>
  </div>
)

export default class About extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = { MyComponent: null }
  }
  // /////////////////////////////////////////////////////////////////////////
  // // Option 1
  // // Behaviour:
  // //   - Loaded component on static build
  // //   - UnLoaded component when react rehydrates
  // //   - Loaded component when dynamic import resolves
  // componentDidMount() {
  //   if (typeof document === 'undefined') {
  //     const { MyComponent } = require('../components/MyComponent')
  //     this.setState({ MyComponent })
  //   } else {
  //     import('../components/MyComponent')
  //       .then(({ MyComponent }) => this.setState({ MyComponent }))
  //       .catch(error => this.setState({ MyComponent: Failed }))
  //   }
  // }
  // /////////////////////////////////////////////////////////////////////////
  // Option 2
  // Behaviour:
  //   - UnLoaded component on static build
  //   - UnLoaded component when react rehydrates
  //   - Loaded component when dynamic import resolves
  componentDidMount () {
    import('../components/MyComponent')
      .then(({ MyComponent }) => this.setState({ MyComponent }))
      .catch(() => this.setState({ MyComponent: Failed }))
  }
  // /////////////////////////////////////////////////////////////////////////
  render () {
    const { MyComponent } = this.state
    if (MyComponent !== null) {
      return (
        <div>
          <h1>This is what we're all about.</h1>
          <MyComponent />
          <p>React, static sites, performance, speed. It's the stuff that makes us tick.</p>
        </div>
      )
    }
    return (
      <div>
        <h1>This is what we're all about.</h1>
        <Loading />
        <p>React, static sites, performance, speed. It's the stuff that makes us tick.</p>
      </div>
    )
  }
}
