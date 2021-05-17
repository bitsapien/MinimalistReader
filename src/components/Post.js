import { useState, useEffect } from 'react'

const getIcon = url => {
  if(url.includes('https://www.youtube.com'))
    return <i class="lni lni-youtube"></i>
}

const Post = ({ post }) => {
  const [postData, setPostData] = useState({})

  const getPost = async() => {
    const data = await post
    setPostData(data)
  }

  useEffect(() => {
    getPost()
  })


  const createPost = ({ title, openGraphData, source, link }) => (
    <section>
      <h3>
        <a href={link} rel="noreferrer" target="_blank" title={link}>
          <i className="lni lni-link"></i> {title}
        </a>
      </h3>
      <span className="source-tag"> {getIcon(source.url)} {source.name} </span>
      {openGraphData['og:image'] ? (<img src={openGraphData['og:image']} alt={title} />) : ''}
    </section>
  )

  const loadingPost = () => ''


  return (<div> {postData.id ? createPost(postData) : loadingPost()} </div>)
}

export default Post
