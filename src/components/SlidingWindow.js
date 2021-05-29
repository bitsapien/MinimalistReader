import React, { useEffect } from "react";
import useOnScreen from "../hooks/useOnScreen";

const SlidingWindowContext = React.createContext({
  visibleList: new Set(),
  setVisibleList: () => {},
});
const SlidingWindowProvider = SlidingWindowContext.Provider;

const SlidingWindow = ({ children, list }) => {
  const [visibleList, setVisibleList] = React.useState(new Set());
  return (
    <SlidingWindowProvider value={{ visibleList, setVisibleList }}>
      {children({ list })}
    </SlidingWindowProvider>
  );
};

export const SlidingWindowItem = ({ children, id }) => {
  const { visibleList, setVisibleList } =
    React.useContext(SlidingWindowContext);
  const ref = React.useRef();
  const isVisible = useOnScreen(ref);
  useEffect(() => {
    let updatedList = visibleList;
    if (isVisible && !visibleList.has(id)) {
      console.log("Adding ", id);
      updatedList.add(id);
      setVisibleList(updatedList);
    } else if (!isVisible && visibleList.has(id)) {
      console.log("Removing ", id);
      updatedList.delete(id);
      setVisibleList(updatedList);
    }
  }, [isVisible, visibleList, setVisibleList, id]);
  return <div ref={ref}>{children}</div>;
};
export default SlidingWindow;
