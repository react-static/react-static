import React from 'react'
import PropTypes from 'prop-types'

import ForgotPasswordForm from '../components/ForgotPasswordForm'
import PasswordChangeForm from '../components/PasswordChangeForm'
import withAuthorization from '../session/withAuthorization'

const Account = (props, { authUser }) => (
  <div>
    <h1>Account: {authUser.email}</h1>
    <ForgotPasswordForm />
    <PasswordChangeForm />
  </div>
)

Account.contextTypes = {
  authUser: PropTypes.object,
}

const authCondition = authUser => !!authUser

export default withAuthorization(authCondition)(Account)
