
const IconForUrl = ({ url }) => {
  if(url.includes('https://www.youtube.com'))
    return <i className="lni lni-youtube"></i>
  if(url.includes('https://news.ycombinator.com') || url.includes('https://hnrss.org'))
    return <i className="lni lni-hacker-news"></i>
  return <span></span>
}

export default IconForUrl
