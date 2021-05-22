import Post from './Post'

const Feed = ({feed}) =>
  feed.map((post, index) => <Post key={index} post={post} />)

export default Feed
