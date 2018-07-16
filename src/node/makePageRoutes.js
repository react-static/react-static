export default function makePageRoutes({
  items,
  pageSize,
  pageToken = 'page',
  route,
  decorate,
}) {
  const itemsCopy = [...items] // Make a copy of the items
  const pages = [] // Make an array for all of the different pages

  while (itemsCopy.length) {
    // Splice out all of the items into separate pages using a set pageSize
    pages.push(itemsCopy.splice(0, pageSize))
  }

  const totalPages = pages.length

  // Move the first page out of pagination. This is so page one doesn't require a page number.
  const firstPage = pages[0]

  const routes = [
    {
      ...route,
      ...decorate(firstPage, 1, totalPages), // and only pass the first page as data
    },
    // map over each page to create an array of page routes, and spread it!
    ...pages.map((page, i) => ({
      ...route, // route defaults
      path: `${route.path}/${pageToken}/${i + 1}`,
      ...decorate(page, i + 1, totalPages),
    })),
  ]

  return routes
}
