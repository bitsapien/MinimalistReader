
const IconForUrl = ({ url, name }) => {
  if(url.includes('https://www.youtube.com'))
    return <span className="source-tag"> <i className="lni lni-youtube"></i> {name} </span>
  if(url.includes('medium.com'))
    return <span className="source-tag"> <i className="lni lni-medium"></i> {name} </span>
  if(url.includes('https://news.ycombinator.com') || url.includes('https://hnrss.org'))
    return <span className="source-tag"> <i className="lni lni-hacker-news"></i> {name} </span>
  return <span></span>
}

export default IconForUrl
