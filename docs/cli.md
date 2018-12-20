# CLI

React Static ships with a CLI that you can use globally to create projects quickly and locally to develop and build your app. Using the CLI is required for React Static to function properly.

To install the CLI globally:

```bash
$ yarn global add react-static
# or
$ npm install -g react-static
```

Using the global CLI to create your projects automatically installs react-static's dependencies to every project you create with it. However, if you ever need to manually install the CLI to an existing project, do the following:

```bash
$ yarn add react-static
# or
$ npm install react-static
```

- [react-static create](#react-static-create)
- [react-static start](#react-static-start)
- [react-static build](#react-static-build)

### `react-static create`

Creates a new react-static project.

- Prompts for a project name/location
- Prompts to select one of the templates located in this repository's `examples/` directory, or you may select `custom` and enter in a git repository to use in the form of `owner/repo`.
- Optionally, you may pass in command line arguments to specify the project name and/or template up front.

- Arguments:
  - `--name=$PROJECT_NAME` where `$PROJECT_NAME` is the desired name for your project (no spaces).
  - `--template=$TEMPLATE_NAME` where `$TEMPLATE_NAME` can be:
    - The name of the template in the `examples` directory
    - The full URL of a public git repository
    - The full path to a local directory

### `react-static start`

Starts the development server.

- Arguments:
  - `--config=$config` where `$config` is the path to the `static.config.js` file to be used.

### `react-static build`

Builds your site for production. Outputs to a `dist` directory in your project.

- Arguments:
  - `--config=$config` where `$config` is the path to the `static.config.js` file to be used.
  - `--staging` - By setting this flag, no siteRoot replacement or path optimizations are performed, allowing a production build of your site to function on localhost more easily. Use this argument to test a production build locally.
  - `--debug` - By setting this flag, your build will **not** be `uglified` allowing you to debug production errors (as long as they are unrelated to minification or uglification)
