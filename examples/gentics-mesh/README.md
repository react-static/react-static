# React Static - Gentics Mesh Example

This example is based on the React Static [basic example](examples/basic) and the [Gentics Mesh](https://getmesh.io/) [Angular Example](https://github.com/gentics/mesh-angular-example).

It uses the following features:
1. [Content tree](https://getmesh.io/docs/beta/features.html#contenttree): organize your content in terms of a content tree, or rather a content <strong>node</strong> tree. Content nodes can be hierarchically structured if a container schema is provided.
1. [Pretty URLs](https://getmesh.io/docs/beta/features.html#prettyurls): instead of relying on UUIDs to link your content, you can use pretty URLs like <code>https://yourapp.com/automobiles/ford-gt/</code>. For each node, Gentics Mesh will provide you with a human readable path.
1. [Navigation Menus](https://getmesh.io/docs/beta/features.html#navigation): When organizing your content in terms of a content node tree, Gentics Mesh offers you a way of generating your front-end navigation dynamically by querying the available navigation endpoints.
1. [Breadcrumbs](https://getmesh.io/docs/beta/features.html#_breadcrumbs): Each node in Gentics Mesh provides information on where it is located within the node tree in terms of its <code>breadcrumb</code> property. The property provides an array of node references representing the path from the current node up to the project root.

## How to run the example
The example is implemented with Angular 5.x and built with the [Angular CLI](https://github.com/angular/angular-cli).

You will need a locally running instance of the [Gentics Mesh](https://getmesh.io/) demo. You can use 
- docker
``` 
docker run -p 8080:8080 gentics/mesh-demo
``` 
- or download the [Gentics Mesh JAR file](https://getmesh.io/Download) and start it with
```  
  java -jar mesh-demo-X.X.X.jar
```
For more details check the [Mesh Administration Guide](https://getmesh.io/docs/beta/administration-guide.html).

Once the Mesh local instance is up and running you can start the example with
`npm start`  or `yarn start` which will start a dev server at [http://localhost:3000](http://localhost:3000).
You can also use `npm build`  or `yarn build` to build the project to the `dist/` directory.

## Implementation notes and caveats
All calls to the Mesh API endpoints are made from [`mesh-api-client.js`](examples/gentics-mesh/src/mesh/mesh-data.service.ts). You can find the configured username and password for the [Mesh API](https://getmesh.io/docs/beta/raml/) calls in [`static.config.js`](examples/gentics-mesh/src/mesh/static.config.js).
Angular CLI proxy configuration can be found in [proxy.conf.js](proxy.conf.js).
The rest of the application logic is contained in the [app component](src/app/app.component.ts) file.

## Using the example with React Static
To get started, run `react-static create` and use the `gentics-mesh` template.

## Current limitations & TODOs
1. Full URL resolution for images still needs to be implemented. Check [`ProductListItem.js`](examples/gentics-mesh/src/containers/ProductListItem.js) where the full URL of the images is hard-coded.
1. Dynamically generate routes in [`static.config.js`](examples/gentics-mesh/src/mesh/static.config.js)
1. Improve navigation bar logic and breadcrumbs
