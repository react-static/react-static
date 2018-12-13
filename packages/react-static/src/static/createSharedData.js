import shorthash from 'shorthash'

export default function createSharedData(data) {
  return {
    hash: shorthash.unique(data),
    data,
  }
}
