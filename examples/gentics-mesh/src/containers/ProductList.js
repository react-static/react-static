import React from 'react'
import { withRouteData, Link } from 'react-static'
//

export default withRouteData(({ items }) => (
  <div>
    <h1>It's blog time.</h1>
    <br />
    All Posts:
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Link to={item.path}>{item.title}</Link>
        </li>
      ))}
    </ul>
  </div>
))
