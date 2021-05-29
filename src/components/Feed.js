import Post from "./Post";
import { readStore } from "../store";
import LazyLoad from "react-lazyload";
import { filterFeed } from "../filters";
import SlidingWindowContainer, { SlidingWindowItem } from "./sliding-window";

const INTERACTIONS = "interactions";
const interactionsFromStore = readStore()[INTERACTIONS] || [];

// sorters
const sortByLatestFirst = (a, b) => new Date(b.isoDate) - new Date(a.isoDate);

const Feed = ({ feed, filters }) => {
  const filteredFeed = filters.length > 0 ? filterFeed(feed, filters) : feed;
  const sortedAndFilteredFeed = filteredFeed.sort(sortByLatestFirst);

  return (
    <div>
      <SlidingWindowContainer list={sortedAndFilteredFeed}>
        {({ from, to, listWithPid }) =>
          listWithPid.map((post, index) => {
            return ifIndexInRange(index, from, to) ? <SlidingWindowItem pid={post.pid} key={post.id}>
              <LazyLoad key={index} offset={200}>
                <Post
                  post={post}
                  interactionsFromStore={interactionsFromStore}
                />
              </LazyLoad>
            </SlidingWindowItem> : null;
          })
        }
      </SlidingWindowContainer>
      <section className="you-are-done">Fin.</section>
    </div>
  );
};

const ifIndexInRange = (index, from, to) => index >= from && index <= to;

export default Feed;
