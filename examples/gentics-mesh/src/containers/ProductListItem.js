import React from 'react'
import { withRouteData, Link } from 'react-static'
//

export default withRouteData(({product}) => (
  <div class="panel panel-default">
    <div class="panel-body">
      <h3>
        <a href={`/product/${product.uuid}`}>{{product.fields.name}}</a>
        <small>{{product.fields.SKU}}</small>
      </h3>

      <a href={`/product/${product.uuid}`}>
        <img className="img-thumbnail" src="/imageUrl(product)" />
      </a>

      <p class="description">{{product.fields.description}}</p>

      <hr/>

        <div class="row">
          <div class="col-xs-6 price">
              <span class="label label-primary">
                {{product.fields.price | currency:'EUR':'symbol'}}
              </span>
          </div>
          <div class="col-xs-6 text-right">
            <span class="label label-default">Weight: {{product.fields.weight}}</span><br/>
            <span class="label label-default">Stock: {{product.fields.stocklevel}}</span>
          </div>
        </div>
    </div>
  </div>
))