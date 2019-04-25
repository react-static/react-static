export default function useBasepath() {
  return process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING === 'true'
    ? ''
    : process.env.REACT_STATIC_BASE_PATH
}
