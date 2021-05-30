import sha256 from 'crypto-js/sha256'
import Utf8 from 'crypto-js/enc-utf8'
import Parser from 'rss-parser'

const generateId = data =>
  sha256(Utf8.parse(unescape(encodeURIComponent((new XMLSerializer()).serializeToString(data))))).toString()

const PROXY_URL = 'http://localhost:8080/'

function timeoutPromise (ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('promise timeout'))
    }, ms)
    promise.then(
      (res) => {
        clearTimeout(timeoutId)
        resolve(res)
      },
      (err) => {
        clearTimeout(timeoutId)
        reject(err)
      }
    )
  })
}

const addMetadata = (items, source) =>
  items.map(item => ({
    ...item,
    id: item.id || item.guid || generateId(item.link + source.url + item.pubDate, toString()),
    source
  }))

const getOpenGraph = async (feed) => {
  const feedy = await feed.map(async (item) => {
    const page = await proxyFetch(item.link)
    const pageHTML = new window.DOMParser().parseFromString(page, 'text/html')
    const openGraphData = Array.from(pageHTML.querySelectorAll('meta'))
      .filter(metaTag => metaTag.getAttribute('property') && metaTag.getAttribute('property').includes('og:'))
      .map(metaTag => [metaTag.getAttribute('property'), metaTag.getAttribute('content')])
      .reduce((obj, item) => {
        obj[item[0]] = item[1]
        return obj
      }, {})

    return { ...item, openGraphData }
  })
  return feedy
}

const proxyFetch = async (url) => {
  const TIMEOUT = 10000
  try {
    const response = await timeoutPromise(TIMEOUT, fetch(PROXY_URL + url))
    if (response.ok) {
      return await response.text()
    }
  } catch (e) {
    console.log('proxyFetch error: ', e)
    return ''
  }
}

const fetchBySource = async ({ url, name }) => {
  // fetch feed
  const result = await new Parser().parseURL(PROXY_URL + url)
  // convert to json
  const feed = addMetadata(result.items, { url, name })
  // fetch og
  const feedWithOg = await getOpenGraph(feed)
  // return feed
  return feedWithOg
}

const fetchAllSources = async (feedSources) => {
  const fetchPromises = feedSources.map(feedSrc => fetchBySource(feedSrc))
  const feedData = await Promise.all(fetchPromises)
  const allfeedDataFlattened = await Promise.all(feedData.flatMap(f => f))
  return allfeedDataFlattened
}

export { fetchAllSources, PROXY_URL }
