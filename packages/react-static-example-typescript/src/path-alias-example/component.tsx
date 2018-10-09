import React from 'react'

// This is referenced in src/containers/About.tsx as an alias example
// You can change the alias to this path inside tsconfig.json -> paths
// Add aliases to import legacy code or existing ts/js components.

const helloFromThePast = (
  <h4>
    TypeScript is enabled. Use it when and where you want. This text was
    imported via a TypeScript alias.
  </h4>
)

export default helloFromThePast
