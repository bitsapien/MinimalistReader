import { useState } from 'react'
import { readStore, writeStore } from '../store'

const getIcon = url => {
  if(url.includes('https://www.youtube.com'))
    return <i class="lni lni-youtube"></i>
}



const Post = ({ post }) => {

  const [heart, setHeart] = useState(post.interactions && post.interactions.hearted)

  const toggleHeart = (heart) => {
    const allFeed = readStore().feedData
    const postInStore = allFeed.data.filter(p => (p.id === post.id && p.link === post.link))[0]
    const feedInStoreWithoutPost = allFeed.data.filter(p => (p.id !== post.id && p.link !== post.link))
    const interactions = { ...postInStore.interactions, ...{ heart: !heart } }
    const newPostInStore = { ...postInStore, interactions}
    writeStore({ key: 'feedData', value: { fetchTime: allFeed.fetchTime  ,data: [...feedInStoreWithoutPost, newPostInStore]}})
    setHeart(!heart)
  }

  const heartStatus = heart ? 'lni lni-heart-filled' : 'lni lni-heart'

  const createPost = ({ title, openGraphData, source, link, interactions }) => (
    <section>
      <h3>
        <a href={link} rel="noreferrer" target="_blank" title={link}>
          <i className="lni lni-link"></i> {title}
        </a>
      </h3>
      <span className="source-tag"> {getIcon(source.url)} {source.name} </span>
      {openGraphData['og:image'] ? (<img src={openGraphData['og:image']} alt={title} />) : ''}
    <div className="panel">
      <button onClick={() => toggleHeart(heart)}> <i className={heartStatus}></i> </button>
    </div>
    </section>
  )



  return (<div> {createPost(post)} </div>)
}

export default Post
