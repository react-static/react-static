module.exports.default = {
  getRoutes: function() {
    var routes = [];

    for (var index = 0; index < 10000; index++) {
      routes.push({
        path: '/' + index,
        component: 'src/Home',
      });
    }

    return routes.map(function(route) {
      return Object.assign(route, {
        getProps: function() {
          return routes;
        },
      });
    });
  },
};
