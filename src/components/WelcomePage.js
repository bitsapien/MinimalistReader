import Logo from './Logo'
import { useState } from 'react'
import AddFeedDialog from './AddFeedDialog'
import Import from './Import'
import { writeStore } from '../store'
import { FEED_SOURCES, INTERACTIONS } from '../constants'

const WelcomePage = ({ setFeedSources, fetchFeedAndSet }) => {
  const [openAddFeedDialog, setOpenAddFeedDialog] = useState(false)

  // actions

  const addFeedSource = ({ url, name }) => {
    fetchFeedAndSet([{ url, name }])
    setFeedSources([{ url, name }])
  }

  const importData = (file) => {
    const reader = new FileReader()
    reader.onloadend = (e) => {
      // overwrite appState
      const jsonFromFile = JSON.parse(e.target.result)
      writeStore({ key: INTERACTIONS, value: jsonFromFile[INTERACTIONS] })
      fetchFeedAndSet(jsonFromFile[FEED_SOURCES])
      setFeedSources(jsonFromFile[FEED_SOURCES])
    }
    reader.readAsText(file)
  }

  return (
  <div>
    <AddFeedDialog open={openAddFeedDialog} setOpen={setOpenAddFeedDialog} addFeedSource={addFeedSource}/>
     <section className="welcome-page">
        <h1><Logo/></h1>
        <p> You have no feed sources, add one using the button below to start or import. 🚀 </p>
        <button onClick={() => setOpenAddFeedDialog(true)}>
            <i className="lni lni-plus"></i> Add feed
        </button>
        <Import importData={importData} />
    </section>
  </div>)
}

export default WelcomePage
