# React-Static - Custom Routing Example

This example includes:
- CSS imports
- Image imports
- File imports
- Custom Routing

To get started, run `react-static create` and use the `custom-routing` template.

## Automatic component routing vs custom routing

In automatic component routing, you setup your routes in getRoutes of static.config.js, where you specify the path and the appropriate component for that path:  
```{path: 'foo', component: 'src/components/MyFoo'}``` This is the easiest way to specify routes.

In custom component routing, you also setup your routes in getRoutes of the static.config.js, but you donÕt specify the component! ```{path: 'foo'}``` Instead, you specify the routes in the components ```<Route path='/foo' component={MyFoo} \>```
It's important to note that you can use one method or the other, but not both. 
