# Algolia

To use algolio in React Static:

- Install the `algoliasearch` module via npm or yarn
- Install the `react-instantsearch` module via npm or yarn
- Create an algolia index at build time. Below is a simple example:

```javascript
import axios from 'axios'
import algoliasearch from 'algoliasearch'

const client = algoliasearch('applicationID', 'adminApiKey')

const addSearchObjects = (indexName, data) => {
  const index = client.initIndex(indexName)
  index.addObjects(data, err => {
    if (err) {
      console.error(err)
    }
  })
}

export default {
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )

    // Add posts data to Algolia with an index key of "posts"
    addSearchObjects('posts', posts)

    return [...]
  },
}
```

- Use `react-instantsearch` to create a search interface using algolia. Below is a simple example:

```javascript
import React from 'react'
import { Link } from '@reach/router'
import { Hits, InstantSearch, SearchBox } from 'react-instantsearch/dom'

const Post = props => {
  const { id, title } = props.hit
  return (
    <div>
      <Link to={`/blog/post/${id}`} title={title}>
        {title}
      </Link>
    </div>
  )
}

export default () => (
  <InstantSearch
    appId="applicationID"
    apiKey="searchOnlyApiKey"
    indexName="posts"
  >
    <SearchBox />
    <Hits hitComponent={Post} />
  </InstantSearch>
)
```
