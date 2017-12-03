import React from 'react'
import { getRouteProps } from 'react-static'

export default getRouteProps(({ post }) => (
  <article>
    <h1>{post.title}</h1>
    <div className="placeholder">
      <img
        alt={post.title}
        src={`https://media.graphcms.com/resize=w:650,h:366,fit:crop/${post.coverImage.handle}`}
      />
    </div>
    <div dangerouslySetInnerHTML={{ __html: post.content }} />
  </article>
))
