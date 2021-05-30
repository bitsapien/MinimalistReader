import SourceTag from './SourceTag'

const FeedSourceList = ({ sources, handleArchive, handleDelete, handleFilter, filters }) => {
  const relevantUrls = filters.filter(filter => filter.name === 'source.url').map(filter => filter.value)

  const filterActiveClass = ({ url }) => relevantUrls.includes(url) ? 'active' : ''

  const allSources = sources.filter(s => !s.deleted).map((feedSrc, index) => (
    <div key={index} className={['feed-source', filterActiveClass(feedSrc)].join(' ')}>
      <span onClick={() => handleFilter(feedSrc)} >
        <SourceTag url={feedSrc.url} name={feedSrc.name} />
      </span>
      <button onClick={() => handleArchive(feedSrc)} className={'delete'}> <i className="lni lni-archive"></i></button>
    </div>
  ))

  const archivedSources = sources.filter(s => s.deleted).map((feedSrc, index) => (
    <div key={index} className={['feed-source', filterActiveClass(feedSrc)].join(' ')}>
      <span onClick={() => handleFilter(feedSrc)} >
        <SourceTag url={feedSrc.url} name={feedSrc.name} />
      </span>
      <button onClick={() => handleDelete(feedSrc)} className={'delete'}> <i className="lni lni-cross-circle"></i></button>
    </div>
  ))

  const archivedSourcesWithHeader = (<div>
    <h5> Archived </h5>
    {archivedSources}
  </div>)

  return (<div>
    {allSources}
    {archivedSources.length > 0 ? archivedSourcesWithHeader : ''}
    </div>)
}


export default FeedSourceList
