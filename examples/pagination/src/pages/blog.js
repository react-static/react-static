import React from 'react'
import { RouteData, Link, Head } from 'react-static'
import styled from 'styled-components'
//

const PaginationLink = styled(({ isCurrent, ...rest }) => <Link {...rest} />)`
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0 0.5rem 0.5rem 0;
  padding: 0.2rem 0.3rem;
  opacity: ${props => (props.isCurrent ? 0.5 : 1)};
`

export default () => (
  <RouteData
    render={({ posts, currentPage, totalPages }) => (
      <div>
        <Head>
          <title>Blog | React Static</title>
        </Head>
        <h1>It's blog time.</h1>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <Link to={`/blog/post/${post.id}/`}>{post.title}</Link>
            </li>
          ))}
        </ul>

        <h5>Pages</h5>
        <div>
          {Array.from(new Array(totalPages), (d, i) => i).map(page => {
            page += 1
            return (
              <span key={page}>
                <PaginationLink to={`/blog/page/${page}`} isCurrent={page === currentPage}>
                  {page}
                </PaginationLink>
              </span>
            )
          })}
        </div>
      </div>
    )}
  />
)
