import { useState, useEffect } from 'react'
import { fetchAllSources } from './fetcher'
import Feed from './components/Feed'
import AddFeedDialog from './components/AddFeedDialog'
import FeedSourceList from './components/FeedSourceList'
import { readStore, writeStore } from './store'
import download from './download'

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
      fetchFeedAndSet([{ url, name }])
    } else {
      console.log('already following')
    }
    setOpenAddFeedDialog(false)
  }

  const fetchFeedAndSet = (feedSourcesList) =>
    fetchAllSources(feedSourcesList).then(data => setFeed(([...feed, ...data]).filter(d => d.id)))

  const exportData = () =>
    download(`minimalist-reader-dump-${Date.now()}.json`, { feedSources })

  // syncing feedSources to storage
  useEffect(() => {
    writeStore({ key: FEED_SOURCES, value: feedSources })
  }, [feedSources])

  // syncing feedData with store
  useEffect(() => {
    const deduplicatedFeed = feed.filter((post, index, self) =>
      index === self.findIndex(p => p.id === post.id)
    )
    writeStore({ key: FEED_DATA, value: { fetchtime: Date.now(), data: deduplicatedFeed } })
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
              <a href="/#" onClick={() => fetchFeedAndSet(feedSources)} title="refresh"> <i className="lni lni-reload"></i> </a>
              <a href="/#" onClick={() => exportData()} title="refresh"> <i className="lni lni-download"></i> Export & Save </a>
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
