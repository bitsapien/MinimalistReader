import Post from './Post'
import { readStore } from '../store'

const INTERACTIONS = 'interactions'
const interactionsFromStore = readStore()[INTERACTIONS] || []

const Feed = ({feed}) =>
  feed.map((post, index) => <Post key={index} post={post} interactionsFromStore={interactionsFromStore}/>)

export default Feed
