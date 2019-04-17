# Using React-Static in AWS Lambda

You can run **React-Static** in **AWS-Lambda** without any modifications.

As the Filesystem is _readonly_ in Serverless Environments we just have to configure the `paths` to write to `/tmp`.

```javascript
//static.config.js
let os = require('os')
const isBuild = process.env.NODE_ENV === 'production'

let pathConfig = {}

if (isBuild) {
  // Lambda OS is UNIX, and tmpdir() is inside a symlink directory, we need the actual path,
  // which is why we use realpathSync
  const tmp = require('fs').realpathSync(os.tmpdir());
  pathConfig = {
    dist: tmp + '/dist',
    temp: tmp + '/tmp',
    buildArtifacts: tmp + '/artifacts',
    devDist: tmp + '/dev-dist',
    assets: tmp + '/dist'
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

require('react-static/lib/utils/binHelper')
const rs = require('react-static/lib/commands/build').default

const handler = async (event, context) => {
  await rs()

  // upload "paths.dist" (/tmp/dist) to some S3 Bucket here
}
```
