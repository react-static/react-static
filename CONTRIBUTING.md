# Contributing

We're stoked that you want to help contribute to React Static! Below are a number of ways you can contribute, even if you're not a developer!

- Give us a shoutout on Twitter and show of your cool site! @reactstaticjs
- Add a site you've built with React Static to our site list in the Readme
- Write a quick article about your experience with React Static and what you enjoyed/disliked?
- Help us write more tests!
- Help us improve our documentation or codebase! You can submit PR's for anything from typos to code comments explaining what a part of the source code does.
- Help others in our [Spectrum Support Community](https://spectrum.chat/react-static)
- Review and help fix [issues](https://github.com/nozzle/react-static/issues)

## Getting started with the source code!

* Install the latest stable version of node
* Install the latest stable version of `yarn` (We use yarn workspaces, so `npm` will not work for development)
* Clone the `react-static` repo to your machine
* Run `yarn` in the root of the repository (will install all dependencies (deduped) for all packages)
* Run a script
  - `yarn watch` - Watches the core packages for changes and compiles them for development
  - `yarn build` - Builds all packages for release
  - `yarn test` - Runs the testing suite for all packages
  - `yarn startDocs` - Starts the documentation site in development mode