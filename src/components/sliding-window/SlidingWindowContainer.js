import React, { useEffect } from "react";
import { SlidingWindowProvider, useSlidingWindowContext } from "./SlidingWindowContext";
import range from './utils';

const SlidingWindowContainer = ({ children, list }) => {
  const listWithPid = list.map((l, pid) => ({ ...l, pid }));
  return (
    <SlidingWindowProvider>
      <SlidingWindow listWithPid={listWithPid}>{children}</SlidingWindow>
    </SlidingWindowProvider>
  );
};

const SlidingWindow = ({ children, listWithPid }) => {
  const { visibleList } = useSlidingWindowContext();
  const [from, setFrom] = React.useState(0);
  const [to, setTo] = React.useState(10);
  useEffect(() => {
    const [_from, _to] = range(listWithPid.length, visibleList);
    setFrom(_from);
    setTo(_to);
  }, [visibleList, listWithPid.length]);
  return children({ from, to, listWithPid });
};

export default SlidingWindowContainer;
