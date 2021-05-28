
// filter utility
const resolvePath = (post, name) => {
  if(name.length > 1)
    return resolvePath(post[name[0]], name.slice(1))
  else
    return post[name[0]]
}

const filterAll = (post, filters) =>
  filters
    .map(filter =>
      resolvePath(post, filter.name.split('.')) === filter.value
    )
    .reduce((acc, curr) => acc || curr, false)

// filterables
const filterFeed = (feed, filters) =>
  feed.filter(post => filterAll(post, filters))

export { resolvePath, filterAll, filterFeed }
