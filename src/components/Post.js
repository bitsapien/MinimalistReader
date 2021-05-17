import { useState, useEffect } from 'react'

const Post = ({ post }) => {
  const [postData, setPostData] = useState({})

  const getPost = async() => {
    const data = await post
    console.log(data)
    setPostData(data)
  }

  useEffect(() => {
    getPost()
  })

  const postPanel = ({ link }) => ''

  const createPost = ({ title, openGraphData, source, link }) => (
    <section>
      <h3>
        <a href={link} rel="noreferrer" target="_blank" title={link}>
          <i class="lni lni-link"></i> {title}
        </a>
      </h3>
      <span> {source} </span>
      {openGraphData['og:image'] ? (<img src={openGraphData['og:image']} alt={title} />) : ''}
      <div className="panel"> {postPanel({ link })} </div>

    </section>
  )

  const loadingPost = () => ''


  return (<div> {postData.id ? createPost(postData) : loadingPost} </div>)
}

export default Post
