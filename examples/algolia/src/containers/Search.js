import React from 'react'
import { Link } from 'react-static'
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
  <InstantSearch appId="applicationID" apiKey="searchOnlyApiKey" indexName="posts">
    <SearchBox />
    <Hits hitComponent={Post} />
  </InstantSearch>
)
