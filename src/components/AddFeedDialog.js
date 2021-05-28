import { useState } from 'react'
import Parser from 'rss-parser'
import { PROXY_URL } from '../fetcher'

const isValidUrl = url => {
  try {
    const urlParsed = new URL(url)
    return urlParsed
  } catch(e) {
    return false
  }
}


const AddFeedDialog = ({ open, setOpen, addFeedSource }) => {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')

  const setAndResolveURL = async(value) => {
    setUrl(value)
    isValidUrl(value) && setName((await new Parser().parseURL(PROXY_URL + value)).title)
  }

  return <div className="dialog" style={{display: open ? 'block' : 'none'}}>
    <div className="dialog-content">
      <h3><i onClick={() => setOpen(false)} className="lni lni-close"></i></h3>
      <div className="dialog-body">
        <label htmlFor="feed-url">
          URL
          <input id="feed-url" type="url" value={url} onChange={(e) => setAndResolveURL(e.target.value)}/>
        </label>
        <label htmlFor="feed-name">
          Name
          <input id="feed-name" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
        </label>
        <button disabled={!(isValidUrl(url) && name)} onClick={() => addFeedSource({ name, url }) && setOpen(false)}> Add </button>
      </div>
    </div>
  </div>
}

export default AddFeedDialog
