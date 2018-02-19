import React from 'react'
import { withRouteData, Link } from 'react-static'
import Moment from 'react-moment';
//

export default withRouteData(({ post }) => {
  return (
    <div className="blog-post">
      <Link to="/blog/">{'<'} Back</Link>
      <br />
      <h3>{post.data.title}</h3>
      <Moment format="MMMM Do, YYYY">{post.data.date}</Moment>
      <img className="image" src={require(`../images/uploads/${post.data.thumbnail}`)} alt="" />
      <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
    </div>
  )
})