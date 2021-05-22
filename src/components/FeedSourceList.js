import IconForUrl from './IconForUrl'

const FeedSourceList = ({ sources }) => {

  return sources.map((feedSrc, index) => (
    <div key={index}>
      <div className="source-tag">
        <IconForUrl url={feedSrc.url}/> {feedSrc.name}
      </div>
    </div>
  ))

}

export default FeedSourceList
