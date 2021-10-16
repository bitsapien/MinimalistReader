const fetchMocked = (url, options) => new Promise((resolve, reject) => {
  if (url === 'http://feed.rss') {
    resolve({ data: [] })
  } else {
    reject(err)
  }
})

module.exports = async () => {
  global.fetch = fetchMocked
}
