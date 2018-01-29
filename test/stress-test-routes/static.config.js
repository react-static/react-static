module.exports.default = {
  getRoutes: function() {
    var routes = [
      {
        path: '/',
        component: 'src/Home'
      }
    ]

    for (var index = 0; index < 1000; index++) {
      routes.push({
        path: '/' + index,
        component: 'src/Home'
      })
    }

    return routes.map(function(route) {
      return Object.assign(route, {
        getProps: function() {
          return routes
        }
      })
    })
  }
}
