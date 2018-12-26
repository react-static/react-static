# Using React-Static in AWS Lambda

You can run **React-Static** in **AWS-Lambda** without any modifications.

As the Filesystem is _readonly_ in Serverless Environments we just have to configure the `paths` to write to `/tmp`.

```javascript
//static.config.js
const isBuild = process.env.NODE_ENV === 'production'

let pathConfig = {}

if (isBuild) {
  pathConfig = {
    temp: os.tmpdir() + '/tmp',
    dist: os.tmpdir() + '/dist',
    devDist: os.tmpdir() + '/dev-server',
    assets: os.tmpdir() + '/dist',
  }
}

export default {
  paths: pathConfig,
  //...
}
```

You also need to set the Babel Cache Variable `BABEL_CACHE_PATH` to (e.g.) `/tmp/babel-cache.json`.

The most simple lambda function would look like this:

```javascript
//set the BABEL_CACHE_PATH as early as possible
process.env.BABEL_CACHE_PATH = '/tmp/babel-cache.json'

const rs = require('react-static/lib/commands/build').default

const handler = async (event, context) => {
  await rs()

  // upload "paths.dist" (/tmp/dist) to some S3 Bucket here
}
```
