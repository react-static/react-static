# React-Static - Gentics Mesh Example

This example is based on the React Static [`basic example](examples/basic) and the [Gentics Mesh](https://getmesh.io/) [Angular Example](https://github.com/gentics/mesh-angular-example).

It uses the following features:
# [Content tree](https://getmesh.io/docs/beta/features.html#contenttree): organize your content in terms of a content tree, or rather a content <strong>node</strong> tree. Content nodes can be hierarchically structured if a container schema is provided.
# [Pretty URLs](https://getmesh.io/docs/beta/features.html#prettyurls): instead of relying on UUIDs to link your content, you can use pretty URLs like <code>https://yourapp.com/automobiles/ford-gt/</code>. For each node, Gentics Mesh will provide you with a human readable path.
# [Navigation Menus](https://getmesh.io/docs/beta/features.html#navigation): When organizing your content in terms of a content node tree, Gentics Mesh offers you a way of generating your front-end navigation dynamically by querying the available navigation endpoints.
# [Breadcrumbs](https://getmesh.io/docs/beta/features.html#_breadcrumbs): Each node in Gentics Mesh provides information on where it is located within the node tree in terms of its <code>breadcrumb</code> property. The property provides an array of node references representing the path from the current node up to the project root.

To get started, run `react-static create` and use the `gentics-mesh` template.
