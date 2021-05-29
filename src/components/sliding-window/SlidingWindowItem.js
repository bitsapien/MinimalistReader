import React, { useEffect } from "react";
import { useOnScreen } from "../../hooks";
import { useSlidingWindowContext } from "./SlidingWindowContext";

export const SlidingWindowItem = ({ children, pid }) => {
  const { visibleList, setVisibleList } = useSlidingWindowContext();
  const ref = React.useRef();
  const isVisible = useOnScreen(ref);
  useEffect(() => {
    let updatedList = new Set(visibleList);
    if (isVisible && !visibleList.has(pid)) {
      updatedList.add(pid);
      setVisibleList(updatedList);
    } else if (!isVisible && visibleList.has(pid)) {
      updatedList.delete(pid);
      setVisibleList(updatedList);
    }
  }, [isVisible, visibleList, setVisibleList, pid]);
  return <div ref={ref}>{children}</div>;
};
