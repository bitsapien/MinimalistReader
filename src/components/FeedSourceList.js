import SourceTag from './SourceTag'


const FeedSourceList = ({ sources, handleDelete }) => {

  return sources.map((feedSrc, index) => (
    <div key={index} className={'feed-source'}>
      <SourceTag url={feedSrc.url} name={feedSrc.name}/>
      <button onClick={() => handleDelete(feedSrc)} className={'delete'}> <i class="lni lni-cross-circle"></i></button>
    </div>
  ))

}

export default FeedSourceList
