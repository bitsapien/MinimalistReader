import React, { useEffect } from "react";
import { SlidingWindowProvider, useSlidingWindowContext } from "./SlidingWindowContext";
import range from './utils';

const SlidingWindowContainer = ({ children, list }) => {
  const listWithPid = list.map((l, pid) => ({ ...l, pid }));
  return (
    <SlidingWindowProvider>
      <SlidingWindow list={listWithPid}>{children}</SlidingWindow>
    </SlidingWindowProvider>
  );
};

const SlidingWindow = ({ children, list }) => {
  const { visibleList } = useSlidingWindowContext();
  const [from, setFrom] = React.useState(0);
  const [to, setTo] = React.useState(10);
  useEffect(() => {
    const [_from, _to] = range(list.length, visibleList);
    console.log({ _from, _to, visibleList });
    setFrom(_from);
    setTo(_to);
  }, [visibleList, list.length]);
  return children({ listWithPid: list.slice(from, to + 1) });
};

export default SlidingWindowContainer;
