# React-Static - Cordova Example

This example includes tweaks to use react-static to make a cordova application. It includes:
- Babel
- CSS imports
- Image imports
- File imports
- Cordova
- Cordova-friendly hot reloading

The bulk of the setup for this example is in `static.config.js`. Check it out!

To get started:
- Run `react-static create` and use the `cordova` template.
- Install cordova globally:
```bash
$ yarn global add cordova
# or
$ npm install -g cordova
```
- In your project, run `cordova prepare`
- Then you can run `yarn start`

## Important
The `res` directory is not included in the CLI example. If you need these files, you can find them at https://github.com/nozzle/react-static/tree/master/examples/cordova/res

Cordova itself does not use `yarn` to manage dependencies, and instead uses `npm`, regardless of what you use yourself. If you are using `yarn` and experience problems after running `cordova prepare` or any other cordova command that could modify node_modules, simply run `yarn` to recompile your dependencies correctly.
