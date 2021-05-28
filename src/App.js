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
  const [filters, setFilters] = useState([])


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
    download(`minimalist-reader-dump-${Date.now()}.json`)

  const deleteFeedSource = ({ name, url }) => {
    const response = window.confirm(`Are you sure you want to delete - ${name} ?`)
    if(response)
      setFeedSources(feedSources.filter(feedSrc => feedSrc.url !== url))
  }

  const filterBySource = (feedSrc) => {
    if(filters.filter(f => f.value === feedSrc.url).length > 0)
      setFilters(filters.filter(f => f.value !== feedSrc.url))
    else
      setFilters([ ...filters, { name: "source.url", value: feedSrc.url} ])
  }

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
              <a href="/#" onClick={() => setOpenAddFeedDialog(true)}> <i className="lni lni-plus"></i> Add feed </a>
              <FeedSourceList sources={feedSources} handleDelete={deleteFeedSource} handleFilter={filterBySource} filters={filters}/>
            </nav>
          </div>
        </header>
        <main>
          <div className="feed">
            <Feed feed={feed} filters={filters}/>
          </div>
          <div className="rightbar">
            <nav>
              <a href="/#" onClick={() => exportData()} title="refresh"> <i className="lni lni-download"></i> Export & Save </a>
              <a href="/#" onClick={() => fetchFeedAndSet(feedSources)} title="refresh"> <i className="lni lni-reload"></i> Reload </a>
            </nav>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App;
