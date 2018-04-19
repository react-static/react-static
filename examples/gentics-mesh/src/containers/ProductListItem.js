import React from 'react'
import * as PropTypes from 'prop-types'
import { Link } from 'react-static'
//

class ProductListItem extends React.Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
  }
  render () {
    const product = this.props.product
    return (

      <div className="panel panel-default">
        <div className="panel-body">
          <h3>
            <Link to={product.path}>{product.fields.name}</Link>
            <small>{product.fields.SKU}</small>
          </h3>

          <Link to={product.path}>
            <img alt={product.fields.name} className="img-thumbnail" src={`https://demo.getmesh.io/api/v1/demo/webroot/${product.fields.vehicleImage.path}`} />
          </Link>

          <p className="description">{product.fields.description}</p>

          <hr />

          <div className="row">
            <div className="col-xs-6 price">
              <span className="label label-primary">{`${product.fields.price} EUR`}</span>
            </div>
            <div className="col-xs-6 text-right">
              <span className="label label-default">Weight: {product.fields.weight}</span><br />
              <span className="label label-default">Stock: {product.fields.stocklevel}</span>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default ProductListItem
