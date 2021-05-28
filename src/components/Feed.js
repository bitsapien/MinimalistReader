import Post from './Post'
import { readStore } from '../store'
import LazyLoad from 'react-lazyload'

const INTERACTIONS = 'interactions'
const interactionsFromStore = readStore()[INTERACTIONS] || []

const sortByLatestFirst = (a, b) => ((new Date(b.isoDate)) - (new Date(a.isoDate)))

const Feed = ({feed}) => {

  const sortedFeed = feed.sort(sortByLatestFirst)

  return (
  <div>
    {sortedFeed.map((post, index) => (
      <LazyLoad key={index}>
        <Post post={post} interactionsFromStore={interactionsFromStore}/>
      </LazyLoad>
    ))}
    <section className="you-are-done">
      Fin.
    </section>
  </div>)
}

export default Feed
