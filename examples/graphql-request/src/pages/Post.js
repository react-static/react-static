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
    {/*
      dangerouslySetInnerHTML is here to parse a markdown field from GraphCMS.
      The field contains a string with HTML tags as GraphCMS already does the markdown parsing.
      If you want to avoid dangerouslySetInnerHTML in your project you can use any html/markdown
      parsing plugin for React like https://github.com/rexxars/react-markdown
    */}
    <div dangerouslySetInnerHTML={{ __html: post.content }} /> {/* eslint react/no-danger: 0 */}
  </article>
))
