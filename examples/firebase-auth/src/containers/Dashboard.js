import React, { Component } from 'react'

import withAuthorization from '../session/withAuthorization'
import { db } from '../firebase'

const fromObjectToList = object =>
  object ? Object.keys(object).map(key => ({ ...object[key], index: key })) : []

class HomePage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      users: [],
    }
  }

  componentDidMount () {
    db
      .onceGetUsers()
      .then(snapshot => this.setState(() => ({ users: fromObjectToList(snapshot.val()) })))
  }

  render () {
    const { users } = this.state

    return (
      <div>
        <h1>Dashboard</h1>
        <p>Dashboard is accessible by every signed in user.</p>

        {!!users.length && <UserList users={users} />}
      </div>
    )
  }
}

const UserList = ({ users }) => (
  <div>
    <h2>List of App User IDs</h2>
    {users.map(user => <div key={user.index}>{user.index}</div>)}
  </div>
)

const authCondition = authUser => !!authUser

export default withAuthorization(authCondition)(HomePage)
