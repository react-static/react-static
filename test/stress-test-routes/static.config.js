module.exports.default = {
  getRoutes: function() {
    const routes = [];

    for (let index = 0; index < 10000; index++) {
      routes.push({
        path: `/${index}`,
        component: 'src/Home',
      });
    }

    return routes.map(route => {
      return {
        ...route,
        getProps: () => ({
          routes,
        }),
      };
    });
  },
};
