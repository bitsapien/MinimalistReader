import { useState, useEffect } from 'react'
import { writeStore } from '../store'
import SourceTag from './SourceTag'
import LazyLoad from 'react-lazyload'
import { humanCategory } from '../categories'
import CategoryTag from './CategoryTag'
import { timeSince } from '../time'
import { INTERACTIONS } from '../constants'
import { PropTypes } from 'prop-types'

const RichContent = ({ og }) => {
  const [isLoading, setIsLoading] = useState(true)
  // if(og['og:video:url'] && og['og:site_name'] === 'YouTube')
  // return (<iframe src={og['og:video:url']} height="420" allow="fullscreen;" title={og['og:title']}></iframe>)
  if (og['og:image']) {
    return (
      <div>
        <LazyLoad offset={100} once>
        <img className={isLoading ? 'loading' : ''} src={og['og:image']} alt={og['og:title']} onLoad={() => setIsLoading(false)}/>
        </LazyLoad>
      </div>
    )
  }

  return null
}

RichContent.propTypes = {
  og: PropTypes.object
}

const LinkedSourceTag = ({ post }) =>
  post.id.startsWith('https://news.ycombinator.com')
    ? (<a href={post.id} title={post.title} target="_blank" rel="noreferrer"> <SourceTag url={post.source.url} name={post.source.name}/> </a>)
    : <SourceTag url={post.source.url} name={post.source.name}/>

LinkedSourceTag.propTypes = {
  post: PropTypes.object
}

const Post = ({ interactionsFromStore, post }) => {
  const interactionForPost = interactionsFromStore.filter(i => i.id === post.id)[0] || { id: post.id }
  const [interaction, setInteraction] = useState(interactionForPost)
  const [showNote, setShowNote] = useState(false)

  // actions
  const setNote = (note) =>
    setInteraction({ ...interaction, note })

  const toggleHeart = (heart) =>
    setInteraction({ ...interaction, heart: !heart })

  const toggleBookmark = (bookmark) =>
    setInteraction({ ...interaction, bookmark: !bookmark })

  // sync to storage
  useEffect(() => {
    const interactionsFromStoreWithoutThis = interactionsFromStore.filter(is => is.id !== post.id)
    writeStore({ key: INTERACTIONS, value: [...interactionsFromStoreWithoutThis, interaction] })
  }, [interaction, interactionsFromStore, post.id])

  const heartStatus = interaction.heart ? 'lni lni-heart-filled text-black' : 'lni lni-heart'
  const bookmarkStatus = interaction.bookmark ? 'lni lni-bookmark text-black' : 'lni lni-bookmark'

  const createPost = ({ id, title, openGraphData, source, link, interactions }) => (
    <section>
      <h3>
        <a href={link} rel="noreferrer" target="_blank" title={link}>
          <i className="lni lni-link"></i> {title}
        </a>
      </h3>
      <LinkedSourceTag post={ { title, id, source } } />
      <RichContent og={openGraphData}/>
      {post.openGraphData && humanCategory(post) && (
        <CategoryTag name={humanCategory(post).humanised} />
      )}
    <div className="panel">
      <button onClick={() => setShowNote(!showNote)} className={showNote ? 'text-black' : ''}> <i className='lni lni-text-align-justify'></i> </button>
      <button onClick={() => toggleHeart(interaction.heart)}> <i className={heartStatus}></i> </button>
      <button className="bookmark" onClick={() => toggleBookmark(interaction.bookmark)}> <i className={bookmarkStatus}></i> </button>
    </div>
    <div className={`note ${showNote ? 'active' : ''}`}>
      <textarea value={interaction.note} onChange={event => setNote(event.target.value)} rows="1"></textarea>
    </div>
    <div className={'time-ago'}> {timeSince(new Date(post.isoDate))} ago </div>
    </section>
  )

  return (<div> {createPost(post)} </div>)
}

Post.propTypes = {
  post: PropTypes.object,
  interactionsFromStore: PropTypes.array
}

export default Post
