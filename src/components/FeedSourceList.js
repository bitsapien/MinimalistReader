import IconForUrl from './IconForUrl'


const FeedSourceList = ({ sources }) => {

  return sources.map((feedSrc, index) => (
    <div key={index}>
      <IconForUrl url={feedSrc.url} name={feedSrc.name}/>
    </div>
  ))

}

export default FeedSourceList
