import React from 'react'
import { Link } from '@reach/router'
import SignInForm from '../components/SignInForm'

export default () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <p>
      <Link to="/forgotpw">Forgot Password?</Link>
    </p>
    <p>
      Don't have an account? <Link to="/signup">Sign Up</Link>
    </p>
  </div>
)
