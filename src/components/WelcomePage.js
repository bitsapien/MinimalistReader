import Logo from './Logo'
import { useState } from 'react'
import AddFeedDialog from './AddFeedDialog'

const WelcomePage = ({ setFeedSources, fetchFeedAndSet }) => {

  const [openAddFeedDialog, setOpenAddFeedDialog] = useState(false)

  const addFeedSource = ({ url, name }) => {
    fetchFeedAndSet([{url, name}])
    setFeedSources([{ url, name}])
  }

 return (
  <div>
    <AddFeedDialog open={openAddFeedDialog} setOpen={setOpenAddFeedDialog} addFeedSource={addFeedSource}/>
     <section className="welcome-page">
        <h1><Logo/></h1>
        <p> You have no feed sources, add one using the button below to start. 🚀 </p>
        <button onClick={() => setOpenAddFeedDialog(true)}>
            <i className="lni lni-plus"></i> Add feed
        </button>
    </section>
  </div>)
}

export default WelcomePage
