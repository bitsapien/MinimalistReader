import Post from './Post'
import { readStore } from '../store'
import { useState } from 'react'

const INTERACTIONS = 'interactions'
const interactionsFromStore = readStore()[INTERACTIONS] || []


const Feed = ({feed}) => {

  return feed.map((post, index) => <Post key={index} post={post} interactionsFromStore={interactionsFromStore}/>)
}

export default Feed
