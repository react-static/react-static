// Set up some scaffolding for automatic data splitting
export const sharedDataByHash = new Map()

export default async function getRouteData(route, state) {
  // Fetch data from each route
  let data = !!route.getData && (await route.getData({ ...state, route }))
  // Default data (must be an object)
  data = data || {}
  // Extract any shared data
  const sharedHashesByProp = {}
  const newSharedData = {}

  if (route.sharedData) {
    Object.keys(route.sharedData).forEach(name => {
      const sharedPiece = route.sharedData[name]
      sharedDataByHash.set(sharedPiece.hash, sharedPiece)
      sharedHashesByProp[name] = sharedPiece.hash
      newSharedData[name] = sharedPiece.data
    })
  }

  return {
    ...route,
    data,
    sharedHashesByProp,
    sharedData: newSharedData,
  }
}
