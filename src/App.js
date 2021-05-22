import { useState, useEffect } from 'react'
import fetcher from './fetcher'
import Feed from './components/Feed'
import AddFeedDialog from './components/AddFeedDialog'
import FeedSourceList from './components/FeedSourceList'
import { readStore, writeStore } from './store'

// Read from store

const FEED_SOURCES = 'feedSources'
const FEED_DATA = 'feedData'

const feedSourcesFromStore = readStore()[FEED_SOURCES] || []
const feedDataFromStore = readStore()[FEED_DATA] || { data: [] }

function App() {
  const [feed, setFeed] = useState(feedDataFromStore.data)
  const [feedSources, setFeedSources] = useState(feedSourcesFromStore)
  const [openAddFeedDialog, setOpenAddFeedDialog] = useState(false)


  // actions
  const addFeedSource = ({ url, name }) => {
    if(feedSources.filter(fs => fs.url === url).length === 0) {
      setFeedSources([...feedSources, { url, name }])
      // fetch new feeds from feed source
      fetchFeed([{ url, name }]).then(data => setFeed(([...feed, ...data]).filter(d => d.id)))
    } else {
      console.log('already following')
    }
    setOpenAddFeedDialog(false)
  }

  const fetchFeed =  async(feedSources) => {
    const fetchPromises = feedSources.map(feedSrc => fetcher(feedSrc))
    const feedData = await Promise.all(fetchPromises)
    const allfeedDataFlattened = await Promise.all(feedData.flatMap(f => f))
    return allfeedDataFlattened
  }

  // syncing feedSources to storage
  useEffect(() => {
    writeStore({ key: FEED_SOURCES, value: feedSources })
  }, [feedSources])

  // syncing feedData with store
  useEffect(() => {
    writeStore({ key: FEED_DATA, value: { fetchtime: Date.now(), data: feed } })
  }, [feed])

  return (
    <div>
      <AddFeedDialog open={openAddFeedDialog} setOpen={setOpenAddFeedDialog} addFeedSource={addFeedSource}/>
      <div className="content">
        <header>
          <div className="sidebar">
            <h3> <i className="lni lni-coffee-cup"></i> Minimalist Reader </h3>
            <nav>
              <FeedSourceList sources={feedSources}/>
              <button onClick={() => setOpenAddFeedDialog(true)}> <i className="lni lni-plus"></i> Add feed </button>
              <a href="/#" > Refresh </a>
            </nav>
          </div>
        </header>
        <main>
          <div className="feed">
            <Feed feed={feed}/>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App;
