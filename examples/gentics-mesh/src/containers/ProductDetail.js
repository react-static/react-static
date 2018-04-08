import React from 'react'
import { withRouteData, Link } from 'react-static'
//

export default withRouteData(({ product }) => (
  <div>
    <Link to="/blog/">{'<'} Back</Link>
    <br />
    <h3>{product.title}</h3>
  </div>
))
