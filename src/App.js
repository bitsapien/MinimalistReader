import { useState, useEffect } from 'react'
import fetcher from './fetcher'
import Post from './components/Post'


function App() {
  const [feed, setFeed] = useState([])

  const fetchIt =  async() => {
    const feedData = await fetcher('http://hnrss.org/newest').then(postFeed => postFeed)
    setFeed(feedData)
  }

  useEffect(() => {
    fetchIt()
  }, [])

  return (
    <div class="content">
      <div className="sidebar">
        <h3> <i class="lni lni-coffee-cup"></i> Minimalist Reader </h3>
        <nav>
          <button href="/add"> <i class="lni lni-plus"></i> Add feed </button>

        </nav>
      </div>
      <div className="feed">
        {feed.map(post => <Post post={post} />)}
      </div>
    </div>
  )
}

export default App;
