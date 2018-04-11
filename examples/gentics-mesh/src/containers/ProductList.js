import React from 'react'
import { withRouteData } from 'react-static'
import ProductListItem from './ProductListItem'
//

export default withRouteData(({ category, items }) => (
  <div>
    <h1>{category.fields.name}</h1>
    <p>{category.fields.description}</p>

    <div className="row">
      {items.map(item => (
        <div className="product-row col-xs-12 col-sm-6 col-md-4" key={item.uuid} >
          <ProductListItem product={item} />
        </div>
      ))}
    </div>
  </div>
))
