import { useState } from 'react'
import { readStore, writeStore } from '../store'

const isValidUrl = url => {
  try {
    const urlParsed = new URL(url)
    return urlParsed
  } catch(e) {
    return false
  }
}

const addFeedStore = ({ name, url }) => {
  const feedSources = readStore()['feedSources'] || []
  const existingCopy = feedSources.filter(f => f.url === url)[0]
  const feedSourcesWithoutOldValue = feedSources.filter(f => f.url !== url)
  const newFeedSource = { ...existingCopy, ...{
    name: name.trim(),
    url: url.trim()
  }}
  writeStore({ key: 'feedSources', value: [...feedSourcesWithoutOldValue, newFeedSource]})
  return true
}

const AddFeedDialog = ({ open, setOpen }) => {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  return <div className="dialog" style={{display: open ? 'block' : 'none'}}>
    <div className="dialog-content">
      <h3><i onClick={() => setOpen(false)} className="lni lni-close"></i></h3>
      <div className="dialog-body">
        <label htmlFor="feed-url">
          URL
          <input id="feed-url" type="text" value={url} onChange={(e) => setUrl(e.target.value)}/>
        </label>
        <label htmlFor="feed-name">
          Name
          <input id="feed-name" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
        </label>
        <button disabled={!(isValidUrl(url) && name)} onClick={() => addFeedStore({ name, url }) && setOpen(false)}> Add </button>
      </div>
    </div>
  </div>
}

export default AddFeedDialog
