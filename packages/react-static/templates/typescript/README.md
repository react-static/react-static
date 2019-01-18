# React-Static - TypeScript Template

To use this template, run `react-static create` and use the `typescript` template.

## Path Aliases for Absolute Imports

`react-static-typescript-plugin` supports path aliases [since v3.1](https://github.com/nozzle/react-static/pull/963#issuecomment-455596728). It has been set up in this template.

```js
// tsconfig.json
{
  // ...
    "paths": {
      "@components/*": ["src/components/*"]
    },
  // ...
}

// this works in your React app
import FancyDiv from '@components/FancyDiv'
```
