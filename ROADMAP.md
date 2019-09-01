# Roadmap

## V8

Version 8 will be focused on becoming compatible with async React which includes both suspense and the expected async server-side-renderer that has yet to be released. The goals for this version may include:

- Rely on suspense and a runtime cache to do just-in-time data fetching
- Remove the requirement to define data dependencies in a config file
- Use React's native mechanisms to perform template and data prefetching (via React.lazy and the suspense cache)
- Support more/any build system (eg. Create React App, Parcel, etc)
