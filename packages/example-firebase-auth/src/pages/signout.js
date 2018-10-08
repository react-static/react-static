import React from 'react'
import PropTypes from 'prop-types'

import SignOutForm from '../components/SignOutForm'
import withAuthorization from '../session/withAuthorization'

const SignOut = (props, { authUser }) => (
  <div>
    <h1>Hi {authUser.email}!</h1>
    <p>Do you want to sign out?</p>
    <SignOutForm />
  </div>
)

SignOut.contextTypes = {
  authUser: PropTypes.object,
}

const authCondition = authUser => !!authUser

export default withAuthorization(authCondition)(SignOut)
