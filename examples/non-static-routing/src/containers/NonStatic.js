import React from 'react'
import { Link, Route } from 'react-static'
//

export default () => (
  <div>
    <h1>Non-Static Route</h1>
    <p>
      This is a non-static route! I am not statically exported, but still
      accessible at runtime. But wait, there is more...
    </p>
    <Link to="/non-static/more">Click here to load a non-static sub-route</Link>
    <br />
    <br />
    <Route
      path="/non-static/more"
      render={() => (
        <div>
          This is a non-static sub-route! I behave exactly like you would expect
          using standard react-router components and route-based rendering
        </div>
      )}
    />
  </div>
)
