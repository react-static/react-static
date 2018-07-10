import React from 'react'
import { withRouteData } from 'react-static'
import Markdown from 'react-markdown'

export default withRouteData(({ post }) => (
  <article>
    <h1>{post.title}</h1>
    <div className="placeholder">
      <img
        alt={post.title}
        src={`https://media.graphcms.com/resize=w:650,h:366,fit:crop/${post.coverImage.handle}`}
      />
    </div>
    <Markdown
      source={post.content}
      escapeHtml={false}
    />
  </article>
))
