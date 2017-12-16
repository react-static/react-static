
import React from 'react'
import PropTypes from 'prop-types'

import SignUpForm from '../components/SignUpForm'

const SignUp = (props, { authUser }) => (
  (<div>
    { authUser
      ? <SignUpAuth />
      : <SignUpNonAuth />
    }
  </div>)
)

SignUp.contextTypes = {
  authUser: PropTypes.object,
}

const SignUpAuth = () =>
  (<p>
    To register new account, please sign out first.
  </p>)

const SignUpNonAuth = () =>
  (<div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>)

export default SignUp
