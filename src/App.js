import { useState, useEffect } from 'react'
import fetcher from './fetcher'
import Post from './components/Post'
import AddFeedDialog from './components/AddFeedDialog'


function App() {
  const [feed, setFeed] = useState([])
  const [openAddFeedDialog, setOpenAddFeedDialog] = useState(false)

  const fetchIt =  async() => {
    const feedData = await fetcher('http://hnrss.org/newest').then(postFeed => postFeed)
    setFeed(feedData)
  }

  useEffect(() => {
    fetchIt()
  }, [])

  return (
    <div>
      <AddFeedDialog open={openAddFeedDialog} setOpen={setOpenAddFeedDialog}/>
      <div class="content">
        <div className="sidebar">
          <h3> <i class="lni lni-coffee-cup"></i> Minimalist Reader </h3>
          <nav>
            <button onClick={() => setOpenAddFeedDialog(true)}> <i class="lni lni-plus"></i> Add feed </button>
          </nav>
        </div>
        <div className="feed">
          {feed.map(post => <Post post={post} />)}
        </div>
      </div>
    </div>
  )
}

export default App;
