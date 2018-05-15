import React from 'react'
import { withRouteData, Link } from 'react-static'
import { Container } from 'reactstrap'

export default withRouteData(({ item }) => (
  <Container>
    <Link to={item.parentNode.path}>{'<'} Back to {item.parentNode.displayName}</Link>
    <h1>{item.displayName}</h1>
    <img width="100%" src={`https://demo.getmesh.io/api/v1/demo/webroot/${item.fields.vehicleImage.path}`} alt={item.fields.name} />
    <p>{item.fields.description}</p>
    <p>Tags:
      {
        item.tags.map(tag => (
          <span className="badge badge-primary" key={tag.uuid}>{ tag.name }</span>
        ))
      }
    </p>
    { item.fields.price === 0 || <p>Price: {item.fields.price}</p> }
  </Container>
))
