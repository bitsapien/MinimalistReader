
const storeName = 'appState'

const writeStore = ({ key, value }) => {
  const newState = {}
  newState[key] = value

  const oldState = readStore() || {}

  localStorage.setItem(storeName, JSON.stringify({ ...oldState, ...newState }))
}


const readStore = () => {
  const state = localStorage.getItem(storeName)
  return state ? JSON.parse(state) : {}
}

export { readStore, writeStore }
