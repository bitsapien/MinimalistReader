import React from "react";

export const SlidingWindowContext = React.createContext({
  visibleList: new Set(),
  setVisibleList: () => {},
});

export const useSlidingWindowContext = () => React.useContext(SlidingWindowContext);

export const SlidingWindowProvider = ({ children }) => {
  const [visibleList, setVisibleList] = React.useState(new Set());
  return (
    <SlidingWindowContext.Provider value={{ visibleList, setVisibleList }}>
      {children}
    </SlidingWindowContext.Provider>
  );
};
