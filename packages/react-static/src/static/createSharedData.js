import shorthash from 'shorthash'

export default function createSharedData(data) {
  return {
    hash: shorthash.unique(JSON.stringify(data)),
    data,
  }
}
