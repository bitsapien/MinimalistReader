
// filter utility
const resolvePath = (post, name) => {
  if (name.length > 1) { return resolvePath(post[name[0]], name.slice(1)) } else { return post[name[0]] }
}

const filterAll = (post, filters) =>
  filters
    .map(filter => {
      const fromPost = resolvePath(post, filter.name.split('.'))
      if (fromPost && filter.ref.startsWith('category:')) { return (fromPost.toLowerCase() === filter.value.toLowerCase()) } else { return fromPost === filter.value }
    })
    .reduce((acc, curr) => acc || curr, false)

// filterables
const filterFeed = (feed, filters) =>
  feed.filter(post => filterAll(post, filters))

export { resolvePath, filterAll, filterFeed }
