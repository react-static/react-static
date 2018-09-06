import React from 'react'
import { RouteData, Link, Head } from 'react-static'
//

export default () => (
  <RouteData
    render={({ users }) => (
      <div>
        <Head>
          <title>Users | React Static</title>
        </Head>
        <h1>All of the users!</h1>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <Link to={`/users/${user.username}/`}>{user.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    )}
  />
)
