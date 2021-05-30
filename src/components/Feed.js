import Post from './Post'
import { readStore } from '../store'
import LazyLoad from 'react-lazyload'
import { filterFeed } from '../filters'
import { useState } from 'react'
import Loader from './Loader'

const INTERACTIONS = 'interactions'
const interactionsFromStore = readStore()[INTERACTIONS] || []

// sorters
const sortByLatestFirst = (a, b) => ((new Date(b.isoDate)) - (new Date(a.isoDate)))

const Feed = ({ feed, filters, isLoading }) => {
  const filteredFeed = filters.length > 0 ? filterFeed(feed, filters) : feed
  const sortedAndFilteredFeed = filteredFeed.sort(sortByLatestFirst)

  const totalPosts = sortedAndFilteredFeed.length
  const [numberOfLoadedPosts, setNumberOfLoadedPosts] = useState(30)

  const buttonOrFin = totalPosts > numberOfLoadedPosts
    ? (<button
        onClick={() => setNumberOfLoadedPosts(numberOfLoadedPosts + 10)}>
          Load More
        </button>)
    : (<section className="you-are-done">
        Fin.
      </section>)

  return (
  <div>
    <div className={ isLoading ? 'feed-loader-icon active' : 'feed-loader-icon' }>
      {isLoading ? <Loader/> : ''}
    </div>
    {sortedAndFilteredFeed.slice(0, numberOfLoadedPosts - 1).map((post, index) => (
      <LazyLoad key={index} offset={200}>
        <Post post={post} interactionsFromStore={interactionsFromStore}/>
      </LazyLoad>
    ))}
    {buttonOrFin}
  </div>)
}

export default Feed
