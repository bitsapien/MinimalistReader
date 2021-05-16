
const rssToJson = (feedXml, source) => {
  const xml = new window.DOMParser().parseFromString(feedXml, "text/xml")
  const items = Array.from(xml.querySelectorAll("item"));
  const regex = /<!\[CDATA\[(.*)\]\]>/;
  console.log(items[1])
  return items.map((item, index) => ({
    id: index,
    title: item.querySelector('title').innerHTML.match(regex)[1],
    link: item.querySelector('link').innerHTML,
    description: item.querySelector('description').innerHTML.replaceAll('\n', '').match(regex)[1],
    source
  }))
}

const fetchOpenGraph = async(feed) => {
  const feedy = await feed.map(async(item) => {
    const page = await fetchViaProxy(item.link)
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

const fetchViaProxy = async(url) => {
  const proxy = 'http://localhost:8080/'
  const response = await fetch(proxy + url)
  if(response.ok) {
    return await response.text()
  }
}
const fetchFeed = async(url) => {
  // fetch feed
  const result = await fetchViaProxy(url)

  // convert to json
  const feed = rssToJson(result, 'hackernews')
  // fetch og
  const feedWithOg = await fetchOpenGraph(feed)
  // return feed
  return feedWithOg

}

export default fetchFeed
