import { useState, useEffect } from 'react'
import fetcher from './fetcher'

const ShowPost = ({ post }) => {
  const [postData, setPostData] = useState({})

  const getPost = async() => {
    const data = await post
    console.log(data)
    setPostData(data)
  }

  useEffect(() => {
    getPost()
  })

  const postImage = (imgLink, title) =>
    imgLink ? (<img src={imgLink} alt={title} />) : ''

  const postPanel = ({ link }) => <a href={link} rel="noreferrer" target="_blank" title={link}> {link} </a>

  const createPost = ({ title, description, openGraphData, source, link }) => (
    <section>
      <h4> {title} </h4>
      <span> {source} </span>
      {postImage(openGraphData['og:image'], title, description)}
      <div className="panel"> {postPanel({ link })} </div>

    </section>
  )

  const loadingPost = () => ''


  return (<div> {postData.id ? createPost(postData) : loadingPost} </div>)
}


function App() {
  const [feed, setFeed] = useState([])

  const fetchIt =  async() => {
    const feedData = await fetcher('http://hnrss.org/newest').then(postFeed => postFeed)
    setFeed(feedData)
  }

  useEffect(() => {
    fetchIt()
  }, [])

  return (
    <div className="feed">
      {feed.map(post => <ShowPost post={post} />)}
    </div>
  )
}

export default App;
