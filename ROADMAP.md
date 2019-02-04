# Roadmap

## V6

Version 6 is a massive upgrade to the underlying tools that power react-static and also offers some new conveniences and features not possible before. These include:

- React 16 (now default)
- Babel 7
- Webpack 4
- New React-Universal-Component
- Extract-CSS-Chunks-Webpack-Plugin
- Multi-threaded Export
- Plugin System
- Pages directory support

## V7

Version 7 will be focused on upgrading to React Hooks and preparing for some very lightweight suspense-compatibility:

- Moving to hooks to power client components
- Retrofitting render prop and HOCs to use the new hooks
- Optionally allowing hooks to be suspense compatible (throw promises and suspend rendering, instead of providing loading states)

## V8

Version 8 will be focused on becoming compatible with async React which includes both suspense and the expected async server-side-renderer that has yet to be released. The goals for this version may include:

- Rely on suspense and a runtime cache to do just-in-time data fetching
- Remove the requirement to define data dependencies in a config file
- Use React's native mechanisms to perform template and data prefetching (via React.lazy and the suspense cache)
- Support more/any build system (eg. Create React App, Parcel, etc)
