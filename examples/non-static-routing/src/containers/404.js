import React from 'react'
//

// The secret to using non-static routes is here.

// We only display the contents of the 404 page after the component mounts.
// This way, when a non-static route loads as the first page, it will not flash
// the static 404 content before react mounts.

// If the route is in fact matched by a non-static route, it will render before
// the 404 page mounts :)
export default class extends React.Component {
  state = {
    ready: false,
  }
  componentDidMount () {
    if (!this.state.ready) {
      this.setState({
        ready: true,
      })
    }
  }
  render () {
    return this.state.ready ? (
      <div>
        <h1>404 - Oh no's! We couldn't find that page :(</h1>
      </div>
    ) : null
  }
}
