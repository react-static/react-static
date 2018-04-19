import * as Device from './Device'

export const getCurrentPosition = async options => {
  await Device.ready()
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  )
}

export const watchPosition = async (...args) => {
  await Device.ready()
  return new Promise(resolve => {
    const id = navigator.geolocation.watchPosition(...args)
    resolve(() => {
      navigator.geolocation.clearWatch(id)
    })
  })
}
