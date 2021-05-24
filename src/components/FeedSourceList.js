import SourceTag from './SourceTag'


const FeedSourceList = ({ sources }) => {

  return sources.map((feedSrc, index) => (
    <div key={index}>
      <SourceTag url={feedSrc.url} name={feedSrc.name}/>
    </div>
  ))

}

export default FeedSourceList
