import Post from './Post'
import { readStore } from '../store'
import LazyLoad from 'react-lazyload'

const INTERACTIONS = 'interactions'
const interactionsFromStore = readStore()[INTERACTIONS] || []


const Feed = ({feed}) => {

  return (
  <div>
    {feed.map((post, index) => (
      <LazyLoad>
        <Post key={index} post={post} interactionsFromStore={interactionsFromStore}/>
      </LazyLoad>
    ))}
    <section className="you-are-done">
      Fin.
    </section>
  </div>)
}

export default Feed
