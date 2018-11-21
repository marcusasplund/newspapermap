const getStateFromStorage = () =>
  JSON.parse(window.localStorage.getItem('newspapermap'))

const storeStateInStorage = (state) =>
  window.localStorage.setItem('newspapermap', JSON.stringify(state))

export { getStateFromStorage, storeStateInStorage }
