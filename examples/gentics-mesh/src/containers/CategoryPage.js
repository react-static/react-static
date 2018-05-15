import React, { Fragment } from 'react'
import { withRouteData } from 'react-static'
import VehicleCard from './VehicleCard'
import { Jumbotron, Button, Container, Row, Col } from 'reactstrap'
import { map, chunk } from 'lodash'

export default withRouteData(({ category, items }) => (
  <Fragment>
    <h1>{category.fields.name}</h1>
    <p className="lead">{category.fields.description}</p>

    <Row>
      {items.map(item => (
        <div className="product-row col-xs-12 col-sm-6 col-md-4" key={item.uuid} >
          <VehicleCard product={item} />
        </div>
      ))}
    </Row>
  </Fragment>
))
