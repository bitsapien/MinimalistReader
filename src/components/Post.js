import { useState, useEffect } from 'react'
import { writeStore } from '../store'
import IconForUrl from './IconForUrl'



const Post = ({ interactionsFromStore, post }) => {

  const interactionForPost = interactionsFromStore.filter(i => i.id === post.id)[0] || { id: post.id }
  const [interaction, setInteraction] = useState(interactionForPost)

  const [showNote, setShowNote] = useState(false)

  // actions
  const setNote = (note) =>
    setInteraction({ ...interaction, note })

  const toggleHeart = (heart) =>
    setInteraction({ ...interaction, heart: !heart})


  // sync to storage
  useEffect(() => {
    const interactionsFromStoreWithoutThis = interactionsFromStore.filter(is => is.id !== post.id)
    writeStore({ key: 'interactions', value: [ ...interactionsFromStoreWithoutThis, interaction]})

  }, [interaction, interactionsFromStore, post.id])

  const heartStatus = interaction.heart ? 'lni lni-heart-filled text-black' : 'lni lni-heart'

  const createPost = ({ id, title, openGraphData, source, link, interactions }) => (
    <section>
      <h3>
        <a href={link} rel="noreferrer" target="_blank" title={link}>
          <i className="lni lni-link"></i> {title}
        </a>
      </h3>
      <span className="source-tag">
        <IconForUrl url={source.url} /> {source.name}
      </span>
      {openGraphData['og:image'] ? (<img src={openGraphData['og:image']} alt={title} />) : ''}
    <div className="panel">
      <button onClick={() => setShowNote(!showNote)} className={showNote ? 'text-black': ''}> <i className='lni lni-notepad'></i> </button>
      <button onClick={() => toggleHeart(interaction.heart)}> <i className={heartStatus}></i> </button>
    </div>
    <div className={`note ${showNote ? 'active': ''}`}>
      <textarea onChange={event => setNote(event.target.value)} rows="1">{interaction.note}</textarea>
    </div>
    </section>
  )



  return (<div> {createPost(post)} </div>)
}

export default Post
