
const rssToJson = (feedXml, source) => {
  const xml = new window.DOMParser().parseFromString(feedXml, "text/xml")
  const items = Array.from(xml.querySelectorAll("item"));
  if(items.length > 0) {
    const regex = /<!\[CDATA\[(.*)\]\]>/;
    return items.map((item, index) => ({
      id: `${source.name}-${item.querySelector('link').innerHTML.replace('/','-')}`,
      title: item.querySelector('title').innerHTML.match(regex)[1],
      link: item.querySelector('link').innerHTML,
      description: item.querySelector('description').innerHTML.replaceAll('\n', '').match(regex)[1],
      source,
      pullDateTime: Date.now()
    }))
  } else {
    const entries = Array.from(xml.querySelectorAll('entry'))
    return entries.map((item, index) => ({
      id: `${source.name}-${item.querySelector('link').getAttribute('href').replace('/','-')}`,
      title: item.querySelector('title').innerHTML,
      link: item.querySelector('link').getAttribute('href'),
      description: '',
      source,
      pullDateTime: Date.now()
    }))
  }
}

const getOpenGraph = async(feed) => {
  const feedy = await feed.map(async(item) => {
    const page = await proxyFetch(item.link)
    const pageHTML = new window.DOMParser().parseFromString(page, 'text/html')
    const openGraphData = Array.from(pageHTML.querySelectorAll('meta'))
      .filter(metaTag => metaTag.getAttribute('property') && metaTag.getAttribute('property').includes('og:'))
      .map(metaTag => [metaTag.getAttribute('property'), metaTag.getAttribute('content')])
      .reduce((obj, item) => {
        obj[item[0]] = item[1]
        return obj
      },{})

    const itemNew = Object.assign({}, item)
    itemNew.openGraphData = openGraphData

    return itemNew
  })
  return feedy
}

const proxyFetch = async(url) => {
  const proxy = 'http://localhost:8080/'
  console.log(fetch)
  const response = await fetch(proxy + url)
  if(response.ok) {
    return await response.text()
  }
}

const fetchBySource = async({ url, name }) => {
  // fetch feed
  const result = await proxyFetch(url)
  // convert to json
  const feed = rssToJson(result, {url, name})
  // fetch og
  const feedWithOg = await getOpenGraph(feed)
  // return feed
  return feedWithOg
}

const fetchAllSources =  async(feedSources) => {
  const fetchPromises = feedSources.map(feedSrc => fetchBySource(feedSrc))
  const feedData = await Promise.all(fetchPromises)
  const allfeedDataFlattened = await Promise.all(feedData.flatMap(f => f))
  return allfeedDataFlattened
}

export { fetchAllSources }
