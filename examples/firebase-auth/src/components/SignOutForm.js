
import React, { Component } from 'react'
import { withRouter } from 'react-static'

import { auth } from '../firebase'

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
})

const INITIAL_STATE = {
  error: null,
}
class SignOutForm extends Component {
  constructor (props) {
    super(props)

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = event => {
    const { history } = this.props

    auth.doSignOut()
      .then(() => {
        history.push('/')
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error))
      })

    event.preventDefault()
  }

  render () {
    const { error } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">
        Sign Out
        </button>
        { error && <p>{error.message}</p> }
      </form>
    )
  }
}

export default withRouter(SignOutForm)
