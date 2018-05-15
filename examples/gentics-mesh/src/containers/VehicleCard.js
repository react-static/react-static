import React from 'react'
import * as PropTypes from 'prop-types'
import { Link } from 'react-static'
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap'
import renderHTML from 'react-render-html'
import Dotdotdot from 'react-dotdotdot'
import NumberFormat from 'react-number-format'

class VehicleCard extends React.Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
  }
  render () {
    const vehicle = this.props.product
    return (
      <Card>
        <CardImg top width="100%" src={`https://demo.getmesh.io/api/v1/demo/webroot/${vehicle.fields.vehicleImage.path}`} alt={vehicle.fields.name} />
        <CardBody>
          <CardTitle><Link to={vehicle.path}>{vehicle.fields.name}</Link></CardTitle>
          <CardSubtitle><NumberFormat value={vehicle.fields.price} displayType={'text'} thousandSeparator={true} suffix={'EUR'} /></CardSubtitle>
          <CardText>{renderHTML(vehicle.fields.description)}</CardText>
        </CardBody>
      </Card>
    )
  }
}

export default VehicleCard
