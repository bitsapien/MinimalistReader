import Post from './Post'
import { readStore } from '../store'
import { useState } from 'react'

const INTERACTIONS = 'interactions'
const interactionsFromStore = readStore()[INTERACTIONS] || []
const MINIMUM_POSTS = 10
const INCREMENT_POSTS_ON_SCROLL = 10


const Feed = ({feed}) => {
  const handleScroll = (e) => {
    const target = e.target.documentElement
      const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
      if (bottom) {
        setLoadTill(loadTill + INCREMENT_POSTS_ON_SCROLL)
      }
  }

  window.addEventListener('scroll', handleScroll)
  const [loadTill, setLoadTill] = useState(MINIMUM_POSTS)


  return feed.slice(0, loadTill).map((post, index) => <Post key={index} post={post} interactionsFromStore={interactionsFromStore}/>)
}

export default Feed
