import Post from './Post'
import { readStore } from '../store'
import LazyLoad from 'react-lazyload'
import { filterFeed } from '../filters'

const INTERACTIONS = 'interactions'
const interactionsFromStore = readStore()[INTERACTIONS] || []

// sorters
const sortByLatestFirst = (a, b) => ((new Date(b.isoDate)) - (new Date(a.isoDate)))

const Feed = ({feed, filters}) => {

  const filteredFeed = filters.length > 0 ? filterFeed(feed, filters) : feed
  const sortedAndFilteredFeed = filteredFeed.sort(sortByLatestFirst)

  return (
  <div>
    {sortedAndFilteredFeed.map((post, index) => (
      <LazyLoad key={index} offset={200}>
        <Post post={post} interactionsFromStore={interactionsFromStore}/>
      </LazyLoad>
    ))}
    <section className="you-are-done">
      Fin.
    </section>
  </div>)
}

export default Feed
