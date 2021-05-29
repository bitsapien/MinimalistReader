import React, { useEffect } from "react";
import useOnScreen from "../hooks/useOnScreen";

const SlidingWindowContext = React.createContext({
  visibleList: new Set(),
  setVisibleList: () => {},
});
const SlidingWindowProvider = SlidingWindowContext.Provider;

const SlidingWindowContainer = ({ children, list }) => {
  const [visibleList, setVisibleList] = React.useState(new Set());
  const listWithPid = list.map((l, pid) => ({...l, pid}));
  return (
    <SlidingWindowProvider value={{ visibleList, setVisibleList }}>
      {children({ list: listWithPid })}
    </SlidingWindowProvider>
  );
};

const SlidingWindow = ({ children, list }) => {
  const { visibleList } =
    React.useContext(SlidingWindowContext);
  
}

export const SlidingWindowItem = ({ children, pid }) => {
  const { visibleList, setVisibleList } =
    React.useContext(SlidingWindowContext);
  const ref = React.useRef();
  const isVisible = useOnScreen(ref);
  useEffect(() => {
    let updatedList = visibleList;
    if (isVisible && !visibleList.has(pid)) {
      console.log("Adding ", pid);
      updatedList.add(pid);
      setVisibleList(updatedList);
    } else if (!isVisible && visibleList.has(pid)) {
      console.log("Removing ", pid);
      updatedList.delete(pid);
      setVisibleList(updatedList);
    }
  }, [isVisible, visibleList, setVisibleList, pid]);
  return <div ref={ref}>{children}</div>;
};
export default SlidingWindowContainer;
