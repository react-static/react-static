import React from 'react'
import { withRouteData } from 'react-static'
import { Link } from '@reach/router'
import Moment from 'react-moment'
import Markdown from 'react-markdown'
//

const renderHeroImage = post => {
  if (post.heroImage)
    return <img className="image" src={post.heroImage.fields.file.url} alt="" />
}

export default withRouteData(({ post }) => (
  <div className="blog-post">
    <Link to="/blog/">{'<'} Back</Link>
    <br />
    <h3>{post.title}</h3>
    <Moment format="MMMM Do, YYYY">{post.date}</Moment>
    {renderHeroImage(post)}
    <Markdown source={post.body} escapeHtml={false} />
  </div>
))
