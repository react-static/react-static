import React from 'react'
import * as PropTypes from 'prop-types'
import { Link } from '@reach/router'
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from 'reactstrap'
import Dotdotdot from 'react-dotdotdot'
import stripHtml from 'string-strip-html'
import NumberFormat from 'react-number-format'

class VehicleCard extends React.Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
  }

  render() {
    const vehicle = this.props.product
    return (
      <Card className="mb-4 box-shadow">
        <CardImg
          top
          width="100%"
          src={`https://demo.getmesh.io/api/v1/demo/webroot/${
            vehicle.fields.vehicleImage.path
          }?w=350&h=225&crop=fp`}
          alt={vehicle.fields.name}
        />
        <CardBody>
          <CardTitle>
            <Link to={vehicle.path}>{vehicle.fields.name}</Link>
          </CardTitle>
          <CardSubtitle>
            <NumberFormat
              value={vehicle.fields.price}
              displayType="text"
              thousandSeparator
              suffix="EUR"
            />
          </CardSubtitle>
          <Dotdotdot clamp={4} tagName="p" className="card-text">
            {stripHtml(vehicle.fields.description)}
          </Dotdotdot>
          <Button className="btn btn-sm btn-outline-primary">
            <Link to={vehicle.path}>View</Link>
          </Button>
        </CardBody>
      </Card>
    )
  }
}

export default VehicleCard
