const humanCategory = (post) => {
  const type = post.openGraphData['og:type'] && post.openGraphData['og:type'].toLowerCase()
  if (!type) { return undefined }
  if (type === 'object' && post.openGraphData['og:site_name'] === 'GitHub') {
    return {
      filters: [
        { name: 'openGraphData.og:site_name', value: 'GitHub', ref: 'category:github' },
        { name: 'openGraphData.og:type', value: 'object', ref: 'category:github' }
      ],
      humanised: 'github'
    }
  } else if (type === 'video.other') {
    return {
      filters: [
        { name: 'openGraphData.og:type', value: 'video.other', ref: 'category:video' }
      ],
      humanised: 'video'
    }
  } else if (type === 'product.group') {
    return {
      filters: [
        { name: 'openGraphData.og:type', value: 'product.group', ref: 'category:product' }
      ],
      humanised: 'product'
    }
  } else if (type) {
    return {
      filters: [
        { name: 'openGraphData.og:type', value: type, ref: `category:${type}` }
      ],
      humanised: type
    }
  }
}

const collectCategories = (feedData) => {
  const categories = feedData.map(post => post.openGraphData && humanCategory(post)).filter(f => f).reduce((acc, curr) => {
    acc[curr.humanised] = curr
    return acc
  }, {})

  return Object.keys(categories).map(humanised => ({
    humanised,
    ...categories[humanised]
  }))
}

export { humanCategory, collectCategories }
