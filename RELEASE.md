## Tests

```
yarn test
```

## Smoke test basic template

```bash
yarn build

cd packages/react-static
```

Now update the blank template (`./templates/blank`) to use a local version:

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

## Inspect CHANGELOG.md

Make sure all changes are listed here

## Run lerna publish

Only maintainers can do this.
