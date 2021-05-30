import { useState, useEffect } from 'react'
import { fetchAllSources } from './fetcher'
import Feed from './components/Feed'
import AddFeedDialog from './components/AddFeedDialog'
import FeedSourceList from './components/FeedSourceList'
import CategoryList from './components/CategoryList'
import { collectCategories } from './categories'
import { readStore, writeStore } from './store'
import download from './download'
import WelcomePage from './components/WelcomePage'
import Logo from './components/Logo'
import Loader from './components/Loader'
import Import from './components/Import'
import { FEED_SOURCES, FEED_DATA, INTERACTIONS } from './constants'

// Read from store
const feedSourcesFromStore = readStore()[FEED_SOURCES] || []
const feedDataFromStore = readStore()[FEED_DATA] || { data: [] }

function App () {
  const [feed, setFeed] = useState(feedDataFromStore.data)
  const [feedLoading, setFeedLoading] = useState(false)
  const [feedSources, setFeedSources] = useState(feedSourcesFromStore)
  const [openAddFeedDialog, setOpenAddFeedDialog] = useState(false)
  const [filters, setFilters] = useState([])

  // actions
  const addFeedSource = ({ url, name }) => {
    if (feedSources.filter(fs => fs.url === url).length === 0) {
      setFeedSources([...feedSources, { url, name }])
      fetchFeedAndSet([{ url, name }])
    } else {
      console.log('already following')
    }
    setOpenAddFeedDialog(false)
  }

  const fetchFeedAndSet = (feedSourcesList) => {
    setFeedLoading(true)
    const sourceUrls = feedSourcesList.map(f => f.url)
    const feedDataForSourcesFromStore = feed.filter(f => sourceUrls.includes(f.source.url))
    fetchAllSources(feedSourcesList.filter(fs => !fs.deleted), feedDataForSourcesFromStore).then(data => {
      setFeed(([...feed, ...data]).filter(d => d.id))
      setFeedLoading(false)
    })
  }

  const exportData = () =>
    download(`minimalist-reader-dump-${Date.now()}.json`)

  const importData = (file) => {
    const reader = new FileReader()
    reader.onloadend = (e) => {
      // overwrite appState
      const jsonFromFile = JSON.parse(e.target.result)
      setFeedSources(jsonFromFile[FEED_SOURCES])
      writeStore({ key: INTERACTIONS, value: jsonFromFile[INTERACTIONS] })
      fetchFeedAndSet(jsonFromFile[FEED_SOURCES])
    }
    reader.readAsText(file)
  }

  const archiveFeedSource = ({ name, url }) => {
    const response = window.confirm(`Are you sure you want to archive - ${name} ? \nFeeds would no longer be fetched from this source.`)
    if (response) {
      const srcToDelete = feedSources.filter(feedSrc => feedSrc.url === url)
      srcToDelete[0].deleted = true
      setFeedSources([...feedSources.filter(f => f.url !== url), ...srcToDelete])
    }
  }

  const unarchiveFeedSource = ({ name, url }) => {
    const srcToDelete = feedSources.filter(feedSrc => feedSrc.url === url)
    srcToDelete[0].deleted = false
    setFeedSources([...feedSources.filter(f => f.url !== url), ...srcToDelete])
  }

  const deleteFeedSource = ({ name, url }) => {
    const response = window.confirm(`Are you sure you want to delete - ${name} ? \nFeeds that are already fetched will be deleted too.`)
    if (response) {
      setFeedSources(feedSources.filter(f => f.url !== url))
      setFeed(feed.filter(f => f.source.url !== url))
    }
  }

  const filterBySource = (feedSrc) => {
    const feedSrcRef = feedSrc.url
    if (filters.filter(f => f.ref === feedSrcRef).length > 0) { setFilters(filters.filter(f => f.ref !== feedSrcRef)) } else { setFilters([...filters, { name: 'source.url', value: feedSrc.url, ref: feedSrcRef }]) }
  }

  const filterByCategory = (category) => {
    const categoryFilters = category.filters
    if (filters.filter(f => f.ref === `category:${category.humanised}`).length > 0) { setFilters(filters.filter(f => f.ref !== `category:${category.humanised}`)) } else { setFilters([...filters, ...categoryFilters]) }
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

  // Show welcome screen if no data
  if (feedSources.length === 0) { return <WelcomePage setFeedSources={setFeedSources} fetchFeedAndSet={fetchFeedAndSet} /> }

  return (
    <div>
      <AddFeedDialog open={openAddFeedDialog} setOpen={setOpenAddFeedDialog} addFeedSource={addFeedSource}/>
      <div className="content">
        <header>
          <div className="sidebar">
            <Logo />
            <nav>
              <a href="/#" onClick={() => setOpenAddFeedDialog(true)}> <i className="lni lni-plus"></i> Add feed </a>
              <FeedSourceList
                sources={feedSources}
                handleDelete={deleteFeedSource}
                handleArchive={archiveFeedSource}
                handleUnarchive={unarchiveFeedSource}
                handleFilter={filterBySource}
                filters={filters}
              />
            </nav>
            <h3> Categories </h3>
            <CategoryList handleFilter={filterByCategory} categories={collectCategories(feed)} filters={filters}/>
          </div>
        </header>
        <main>
          <div className="feed">
            <Feed feed={feed} filters={filters}/>
          </div>
          <div className="rightbar">
            <nav>
              <a href="/#" onClick={() => exportData()} title="refresh"> <i className="lni lni-download"></i> Export & Save </a>

              <Import importData={importData} />
              <a href="/#" onClick={() => fetchFeedAndSet(feedSources)} title="refresh" disabled={feedLoading}>
                <i className="lni lni-reload"></i> Reload
              </a>
            </nav>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
