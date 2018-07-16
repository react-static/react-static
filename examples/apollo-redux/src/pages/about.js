import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
//

// /////////////////////////////////////////////////////////
// GraphQL components
// From https://www.apollographql.com/docs/react/basics/queries.html
// Display component
const Person = ({ data: { loading, error, Fake } }) => {
  if (loading) {
    return <p>Loading...</p>
  } else if (error) {
    return <p>Error!</p>
  }
  return (
    <div>
      <p>Loaded successfully:</p>
      <p>First name: {Fake.firstName}</p>
      <p>Last name: {Fake.lastName}</p>
    </div>
  )
}
// Connexion with apollo
const PersonWithData = graphql(gql`
  query {
    Fake {
      _id
      firstName
      lastName
    }
  }
`)(Person)

// /////////////////////////////////////////////////////////
// Redux components
// From http://redux.js.org/docs/basics/UsageWithReact.html
// Display component
const Counter = ({ count, increment, reset }) => (
  <div>
    <p>Value: {count}</p>
    <button onClick={increment}>Increment</button>
    <button onClick={reset}>Reset</button>
  </div>
)
// Connexion with redux
const CounterConnected = connect(
  ({ counter: { count } }) => ({
    count,
  }),
  dispatch => ({
    increment: () => dispatch({ type: 'INCREMENT' }),
    reset: () => dispatch({ type: 'RESET' }),
  })
)(Counter)

// /////////////////////////////////////////////////////////
// Actual container
const About = () => (
  <div>
    <h1>This is what we're all about.</h1>
    <p>
      React, static sites, performance, speed. It's the stuff that makes us
      tick.
    </p>
    <h2>Here is a person loaded from graphql:</h2>
    <PersonWithData />
    <h2>Here is a redux counter:</h2>
    <CounterConnected />
  </div>
)

export default About
