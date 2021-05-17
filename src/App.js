import { useState, useEffect } from 'react'
import fetcher from './fetcher'
import Post from './components/Post'
import AddFeedDialog from './components/AddFeedDialog'
import { readStore, writeStore } from './store'


const getIcon = url => {
  if(url.includes('https://www.youtube.com'))
    return <i class="lni lni-youtube"></i>
}

const FeedSourceList = ({ sources }) => {

  return sources.map((feedSrc, index) => (
    <div>
      <div key={index} className="source-tag">{getIcon(feedSrc.url)} {feedSrc.name} </div>
    </div>
  ))

}

function App() {
  const [feed, setFeed] = useState([])
  const [openAddFeedDialog, setOpenAddFeedDialog] = useState(false)

  const feedSources = readStore()['feedSources']
  const feedDataFromStore = readStore()['feedData']

  const fetchIt =  async(feedSources, feedDataFromStore) => {
    const fetchPromises = feedSources.map(feedSrc => fetcher({ name: feedSrc.name, url: feedSrc.url }))
    const feedData = await Promise.all(fetchPromises)
    const allfeedDataFlattened = await Promise.all(feedData.flatMap(f => f))
    // set local storage
    const all = [...feedDataFromStore, ...allfeedDataFlattened]
    writeStore({ key: 'feedData', value: {fetchTime: Date.now(), data: all} })
    setFeed(all)

  }

  useEffect(() => {
    if(feedDataFromStore && feedDataFromStore.fetchTime < (Date.now() + 60*60*3))
      setFeed(feedDataFromStore.data.filter(d => d.id))
    else
      fetchIt(feedSources, feedDataFromStore)
  }, [])

  return (
    <div>
      <AddFeedDialog open={openAddFeedDialog} setOpen={setOpenAddFeedDialog}/>
      <div className="content">
        <div className="sidebar">
          <h3> <i className="lni lni-coffee-cup"></i> Minimalist Reader </h3>
          <nav>
            <FeedSourceList sources={feedSources}/>
            <button onClick={() => setOpenAddFeedDialog(true)}> <i className="lni lni-plus"></i> Add feed </button>
          </nav>
        </div>
        <div className="feed">
          {feed.map((post, index) => <Post key={index} post={post} />)}
        </div>
      </div>
    </div>
  )
}

export default App;
