export default async function fetchSiteData(state) {
  const siteData = await state.config.getSiteData(state)
  return {
    ...state,
    siteData,
  }
}
