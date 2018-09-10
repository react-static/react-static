const arraySize = 10000
const routeSize = 10000
const propCollision = 20

console.log()
console.log(
  `Testing ${routeSize} routes with a prop-array-size of ${arraySize} and a prop collision rate of ${propCollision}`
)

export default {
  getRoutes: async () => {
    const fakeData = []

    for (let index = 0; index < arraySize; index++) {
      fakeData.push(`string_${Math.random()}`)
    }

    const routes = [
      {
        path: '/',
        component: 'src/Home',
      },
    ]

    for (let index = 0; index < routeSize; index++) {
      routes.push({
        path: `/${index}`,
        component: index % 2 === 0 ? 'src/Home' : 'src/About',
        getProps: () => ({
          [`prop_${Math.floor(Math.random() * propCollision)}`]: fakeData,
        }),
      })
    }

    return routes
  },
}
