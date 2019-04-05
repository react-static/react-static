import React from 'react'

type DF = React.FC<{ path?: String }>
const Dynamic: DF = () => (
  <div>
    This is a dynamic page! It will not be statically exported, but is available
    at runtime
  </div>
)
export default Dynamic
