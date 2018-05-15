import React from 'react'
import { withRouteData, Link } from 'react-static'
//

export default withRouteData(({ item }) => (
  <div>
    <Link to={item.parentNode.path}>{'<'} Back to {item.parentNode.displayName}</Link>
    <br />
    <h3>{item.displayName}</h3>
  </div>
))
