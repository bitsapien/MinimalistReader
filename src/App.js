import { useState, useEffect } from 'react'
import rssToJson from './rssToJson'
// State
const subscriptions = [
  {
    name: 'Hacker News',
    id: 'hacker-news',
    src: 'https://hnrss.org/frontpage'
  },
  {
    name: 'Paul Graham',
    id: 'paul-graham',
    src: 'https://hnrss.org/newest'
  }
]

const subscriptionFeeds = [
  {
    id: '1111',
    title: 'How can I resolve “502 Bad Gateway Nginx/1.14.0 (Ubuntu)”?',
    link: 'https://www.digitalocean.com/community/questions/how-can-i-resolve-502-bad-gateway-nginx-1-14-0-ubuntu',
    description: {
      pubDate: 'Sat, 01 May 2021 04:12:49 +0000',
    }
  },
  {
    id: '1114',
    title: 'Mocked external Page',
    link: 'http://localhost:3001/iframe-content',
    description: {
      pubDate: 'Sat, 01 May 2021 04:12:49 +0000',
    }
  }
]

// Subscriptions
const Subscriptions = ({ subscriptions, setfeedUrl }) => {
  const subscriptionLinksSet = subscriptionLinks(subscriptions, setfeedUrl)
  return (<nav> <ul> {subscriptionLinksSet} </ul> </nav>)
}

const subscriptionLinks = (subscriptions, setfeedUrl) =>{
  return subscriptions.map(subscription => (<li key={subscription.id}><span onClick={() => setfeedUrl(subscription.src)}> {subscription.name} </span></li>))
}
// Feed List
const SubscriptionFeed = ({ feedUrl }) => {
  const [feed, setFeed] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const proxy = 'http://localhost:8080/'
    const fetchFeed = async() => {
      setIsLoading(true)
      const response = await fetch(proxy + feedUrl)
      if(response.ok) {
        const responseTxt = await response.text()
        setFeed(responseTxt)
      }
      setIsLoading(false)
    }
    fetchFeed()
  }, [feedUrl])

  const loading = (<span> loading .. </span>)
  const subscriptionFeeds = isLoading ? [] : rssToJson(feed)

  return (<ul> {isLoading ? loading : subscriptionFeedLinks(subscriptionFeeds)} </ul>)
}

const subscriptionFeedLinks = subscriptionFeeds =>
  subscriptionFeeds.map(subscriptionFeed => (<li key={subscriptionFeed.id}> <a href={subscriptionFeed.link}> {subscriptionFeed.title}</a> </li>))


function App() {
  const [feedUrl, setfeedUrl] = useState(subscriptions[0].src)

  return (
    <div className="app">
      <Subscriptions subscriptions={subscriptions} setfeedUrl={setfeedUrl}/>
      <div className="right">
        <SubscriptionFeed feedUrl={feedUrl}/>
      </div>
    </div>
  );
}

export default App;
