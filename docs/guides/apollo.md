# Apollo

With React Static you may want to use Apollo:

- For the static routes and pages generation at build time
- To fetch fresh data on the client from your GraphQL API Server or make updates using GraphQL Mutations.

## Data fetching on the client

Fetching data on the client with `react-static` is very similar to doing it from a simple React project or `create-react-app`.

The only thing you need to be aware of is that you need to use the full `apollo-client` package and not `apollo-boost`, because you need to customize the Apollo client.

In fact, you need to specify `node-fetch` as the fetch method of the `HttpLink`, because the query will be called from Node, too.

First of all you have to install all the required packages:

```sh
yarn add apollo-client apollo-cache-inmemory apollo-link-http react-apollo graphql-tag graphql node-fetch
```

Then you may create a module which exports your Apollo client, like this:

```javascript
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://your-api-server/graphql',
    fetch,
  }),
  cache: new InMemoryCache(),
})

export default client
```

And use it in your app, wrapping the components who need to query your graphql server in a `ApolloProvider` component:

```javascript
import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'
import { ApolloProvider } from 'react-apollo'

import client from './apolloClient'

import './app.css'

function App() {
  return (
    <ApolloProvider client={client}>
      <Root>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
        </nav>
        <div className="content">
          <Routes />
        </div>
      </Root>
    </ApolloProvider>
  )
}

export default App
```

## Build-time data fetching

As for build-time data fetching, we can just use the same Apollo client as before in our `static.config.js`.

For example, here I build the `/products` route giving it the `products` data prop and all the children routes `/products/:seoName` giving them the `product` data.

```javascript
import client from './src/apolloClient'
import GET_PRODUCTS from './src/graphql/getProducts'

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const {
      data: { allProducts: products },
    } = await client.query({
      query: GET_PRODUCTS,
    })

    return [
      {
        path: '/products',
        template: 'src/pages/Products',
        getData: () => ({
          products,
        }),
        children: products.map(product => ({
          path: `/${product.seoName}`,
          template: 'src/pages/Product',
          getData: () => ({
            product,
          }),
        })),
      },
    ]
  },
}
```

## Mixing client-side and build-time data fetching

Often it may be useful to both query data at build time and live on the client, for example you may want to:

- Fetch the data for the static routes to have the SEO optimized pages and perceived performance gain, in particular for slow changing data (for an e-commerce, think at the product name, description, image...)
- Query the APIs from the client to fetch fast changing data (for an e-commerce, think at the available stock) and to mutate data (for example, place an order).

I show you how, in the single Product page (`/products/:seoName`) created for the example before, we can use both the the static data from the build and do a live query to update a fast changing attribute, like the stock or the price.

```javascript
import React from 'react'
import { withRouteData } from 'react-static'
import { Query } from 'react-apollo'
import GET_PRODUCT from '../graphql/getProduct'

export default function Product() {
  {
    /* STATIC DATA FROM THE BUILD */
  }
  const { product } = useRouteData()

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.shortDescription}</p>
      <img src={product.imageUrl} alt={product.name} />

      <Query query={GET_PRODUCT} variables={{ seoName: product.seoName }}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error :(</p>

          return (
            <div>
              {/* LIVE DATA FROM THE QUERY */}
              <p>Price: {data.product.price}</p>
              <p>Stock: {data.product.stock}</p>
            </div>
          )
        }}
      </Query>
    </div>
  )
}
```
