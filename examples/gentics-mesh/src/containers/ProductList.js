import React from 'react'
import { withRouteData, Link } from 'react-static'
//

export default withRouteData(({ items }) => (
  <div>
    All items:
    <ul>
      {items.map(item => (
        <li key={item.uuid}>
          <Link to={item.path}>{item.displayName}</Link>
        </li>
      ))}
    </ul>
  </div>
))
