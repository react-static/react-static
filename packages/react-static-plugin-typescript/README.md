# react-static-plugin-typescript

A plugin for [React Static](https://react-static.js.org/) that allows you to use [TypeScript](https://www.typescriptlang.org/).

There instructions for enabling this plugin on existing projects below. When setting up a new project using React Static, you can simply select the TypeScript [template](https://github.com/react-static/react-static/tree/master/packages/react-static/templates) after running `react-static create`.

## Installation

```bash
npm install react-static-plugin-typescript @types/react --save-dev
```

## Usage

There are three steps to complete before being able to use this plugin.

First, add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ['react-static-plugin-typescript'],
}
```

Then add a `tsconfig.json`, e.g. this one:

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2015", "dom"],
    "moduleResolution": "node",
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowJs": true,
    "jsx": "preserve",
    "sourceMap": true,
    "removeComments": false,
    "strict": true,
    "esModuleInterop": true
  }
}
```

Finally, rename a file from `.js` to `.tsx`. You can then start using TypeScript!

## Options

Options [can be passed by using an array](https://github.com/react-static/react-static/tree/master/docs/plugins#plugin-options), e.g.:

```javascript
// In static.config.js:
export default {
  plugins: [['react-static-plugin-typescript', { typeCheck: true }]],
}
```

### `typeCheck: boolean`

Default value: `true`

Enable or disable type checking for your application during compilation. When this is off, your TypeScript files will still be loaded, but you won't get warnings about type errors unless you set that up separately, e.g. in your editor, a commit hook, or in your CI server. When this is on, your application will fail to run locally when there are type errors.

## Changelog

See [`CHANGELOG.md`](https://gitlab.com/Vinnl/react-static-plugin-typescript/blob/master/CHANGELOG.md).

## License

MIT © [Vincent Tunru](https://vincenttunru.com)
