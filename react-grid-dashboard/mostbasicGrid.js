import React, { useState, useEffect } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";

// Wrap the grid in a WidthProvider for automatic adjustment
const ResponsiveGridLayout = WidthProvider(Responsive);

// Function to generate initial layout for all breakpoints
const generateInitialLayouts = () => ({
  lg: [
    { i: "section1", x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section2", x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section3", x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section4", x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 3, static: false },
  ],
  md: [
    { i: "section1", x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section2", x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section3", x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section4", x: 3, y: 3, w: 3, h: 3, minW: 2, minH: 3, static: false },
  ],
  sm: [
    { i: "section1", x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section2", x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section3", x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section4", x: 3, y: 3, w: 3, h: 3, minW: 2, minH: 3, static: false },
  ],
  xs: [
    { i: "section1", x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section2", x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section3", x: 0, y: 6, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section4", x: 0, y: 9, w: 3, h: 3, minW: 2, minH: 3, static: false },
  ],
  xxs: [
    { i: "section1", x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section2", x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section3", x: 0, y: 6, w: 3, h: 3, minW: 2, minH: 3, static: false },
    { i: "section4", x: 0, y: 9, w: 3, h: 3, minW: 2, minH: 3, static: false },
  ],
});

const SampleGrid = () => {
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = getFromLS("layouts");
    return savedLayouts?.layouts || generateInitialLayouts();
  });

  useEffect(() => {
    saveToLS("layouts", { layouts });
  }, [layouts]);

  const handleLayoutChange = (layout, allLayouts) => {
    setLayouts(allLayouts);
  };

  return (
    <>
    <h1>Basic Example</h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={30}
        onLayoutChange={(layout, allLayouts) =>
          handleLayoutChange(layout, allLayouts)
        }
      >
        <div key="section1" style={{ border: "2px solid #ccc" }}>
          {"Section 1"}
        </div>
        <div key="section2" style={{ border: "2px solid #ccc" }}>
          {"Section 2"}
        </div>
        <div key="section3" style={{ border: "2px solid #ccc" }}>
          {"Section 3"}
        </div>
        <div key="section4" style={{ border: "2px solid #ccc" }}>
          {"Section 4"}
        </div>
      </ResponsiveGridLayout>
      <div>
     Reset Button{" "}
        <button
          onClick={() => {
            const initialLayouts = generateInitialLayouts();
            console.log(';-------------------',initialLayouts)
            setLayouts(initialLayouts); // Directly set layouts to the initial state
            saveToLS("layouts", { layouts: initialLayouts }); // Save to localStorage
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
};

//get data from localstorage
const getFromLS = (key) => {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(key)) || {};
    } catch (e) {
      /* Ignore errors */
    }
  }
  return ls;
};

//save changed layout to localstorage
const saveToLS = (key, value) => {
  if (global.localStorage) {
    global.localStorage.setItem(key, JSON.stringify(value));
  }
};

export default SampleGrid;
