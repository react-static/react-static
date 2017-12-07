const ReadyPromise = new Promise(resolve =>
  document.addEventListener('deviceready', resolve, false),
)

export const ready = () => ReadyPromise
