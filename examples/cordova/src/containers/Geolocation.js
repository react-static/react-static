import React, { Component } from 'react'
import * as Geolocation from 'utils/Geolocation'
//

export default class MyLocation extends Component {
  state = {
    startingLocation: {},
  }

  async componentWillMount() {
    // get current position
    const startingLocation = await Geolocation.getCurrentPosition()
    this.setState({
      startingLocation,
    })

    this.stopWatching = await Geolocation.watchPosition(
      pos => {
        this.setState({
          currentLocation: pos,
        })
      },
      err => {
        console.error('Oh no! There was an error trying to locate you.', err)
      }
    )
  }

  componentWillUnmount() {
    // to stop watching
    if (this.stopWatching) this.stopWatching()
  }

  render() {
    const { startingLocation, currentLocation } = this.state
    return (
      <div>
        <h1>Geolocation Demo</h1>
        <p>Starting Location:</p>
        <pre>{JSON.stringify(startingLocation, null, 2)}</pre>
        <p>Current Location:</p>
        <pre>{JSON.stringify(currentLocation, null, 2)}</pre>
      </div>
    )
  }
}
