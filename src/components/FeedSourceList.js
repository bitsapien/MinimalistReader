import SourceTag from './SourceTag'

const FeedSourceList = ({ sources, handleDelete, handleFilter, filters }) => {
  const relevantUrls = filters.filter(filter => filter.name === 'source.url').map(filter => filter.value)

  const filterActiveClass = ({ url }) => relevantUrls.includes(url) ? 'active' : ''

  return sources.map((feedSrc, index) => (
    <div key={index} className={['feed-source', filterActiveClass(feedSrc)].join(' ')}>
      <span onClick={() => handleFilter(feedSrc)} >
        <SourceTag url={feedSrc.url} name={feedSrc.name} />
      </span>
      <button onClick={() => handleDelete(feedSrc)} className={'delete'}> <i className="lni lni-cross-circle"></i></button>
    </div>
  ))
}

export default FeedSourceList
