const rssToJson = feedXml => {
  const xml = new window.DOMParser().parseFromString(feedXml, "text/xml")
  const items = Array.from(xml.querySelectorAll("item"));
  const regex = /<!\[CDATA\[(.*)\]\]>/;
  return items.map((item, index) => ({
    id: index,
    title: item.querySelector('title').innerHTML.match(regex)[1],
    link: item.querySelector('link').innerHTML,
    description: item.querySelector('description').innerHTML.replaceAll('\n', '').match(regex)[1],
  }))
}
export default rssToJson
