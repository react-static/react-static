## Tests

```
yarn test
```

## Smoke test basic template

```bash
yarn build

cd src/packages/react-static
```

Now update the blank template to use a local version:

```json
"react-static": "../../react-static"
```

Do the same for each plugin.

```bash
./bin/react-static create
# use blank

cd my-static-site
yarn start
# inspect

yarn build
# inspect
```

## Bump versions in templates

In each template, bump the package versions to the correct version.

## Inspect CHANGELOG.md

Make sure all changes are listed here

## Run lerna publish


