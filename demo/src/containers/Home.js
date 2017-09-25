import React from 'react'
import { Link } from 'react-router-dom'
//
export default () => (
  <div>
    <h1>Welcome Home!</h1>
    <br />
    <Link to="/about">About Us</Link>
    <br />
    <Link to="/blog">Visit the blog!</Link>
  </div>
)
