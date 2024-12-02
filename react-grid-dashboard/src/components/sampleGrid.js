import React, { useState, useEffect } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";

// Wrap it with WidthProvider to make it responsive
const ResponsiveGridLayout = WidthProvider(Responsive);

// Generate initial layouts for sections and their children
const generateInitialLayouts = () => ({
  lg: [
    {
      id: "#123",
      i: "section1",
      x: 0,
      y: 0,
      w: 12,
      h: 28,
      static: false,
      children: [
        {
          id: "#234",
          i: "item1",
          w: 1,
          h: 3,
          x: 0,
          y: 0,
          moved: false,
          static: false,
        },
        {
          id: "#244",
          i: "item2",
          w: 1,
          h: 3,
          x: 1,
          y: 0,
          moved: false,
          static: false,
        },
        {
          id: "#214",
          i: "item3",
          w: 1,
          h: 9,
          x: 2,
          y: 0,
          moved: false,
          static: false,
        },
        {
          id: "#224",
          i: "item4",
          w: 1,
          h: 3,
          x: 0,
          y: 3,
          moved: false,
          static: false,
        },
        { i: "item5", w: 1, h: 3, x: 1, y: 3, moved: false, static: false },
        { i: "item6", w: 1, h: 3, x: 0, y: 6, moved: false, static: false },
        { i: "item7", w: 1, h: 3, x: 1, y: 6, moved: false, static: false },
        { i: "item8", w: 2, h: 3, x: 0, y: 9, moved: false, static: false },
        { i: "item9", w: 1, h: 10, x: 2, y: 9, moved: false, static: false },
        { i: "item10", w: 2, h: 7, x: 0, y: 12, moved: false, static: false },
      ],
    },
    {
      i: "section2",
      x: 28,
      y: 0,
      w: 12,
      h: 3,
      static: false,
      children: [
        { i: "item1", w: 1, h: 1, x: 0, y: 0, moved: false, static: false },
        { i: "item2", w: 1, h: 1, x: 1, y: 0, moved: false, static: false },
        { i: "item3", w: 1, h: 1, x: 2, y: 0, moved: false, static: false },
      ],
    },
  ],
});

// Save and Load Layouts from localStorage
const getFromLS = (key) => {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(key)) || {};
    } catch (e) {
      console.error(e);
    }
  }
  return ls;
};

const saveToLS = (value) => {
  localStorage.setItem("layouts", JSON.stringify(value));
};

// NestedGrid Component for handling children layouts
const NestedGrid = ({ sectionId, children, onLayoutChange }) => {
  const [childLayouts, setChildLayouts] = useState({
    lg: children, // Initial child layouts
    md: children, // Same for other breakpoints
    sm: children,
    xs: children,
    xxs: children,
  });

  const handleNestedLayoutChange = (layout, allLayouts) => {
    const updatedLayouts = allLayouts.lg;
    setChildLayouts(allLayouts);
    onLayoutChange(sectionId, updatedLayouts);
  };

  return (
    <ResponsiveGridLayout
      className="nested-grid"
      layouts={childLayouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 3, md: 3, sm: 2, xs: 3, xxs: 3 }}
      rowHeight={30}
      isDraggable
      isResizable
      onDragStart={(layout, oldItem, newItem, placeholder, e, element) => {
        e.stopPropagation();
      }}
      onLayoutChange={(newLayout, allLayouts) => {
        handleNestedLayoutChange(newLayout, allLayouts);
      }}
    >
      {childLayouts.lg &&
        childLayouts.lg.map((item) => (
          <div
            key={item.i}
            style={{ border: "1px solid #000" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span>{item.i}</span>
          </div>
        ))}
    </ResponsiveGridLayout>
  );
};

// SampleGrid Component for handling the parent section layouts
const SampleGrid = () => {
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = getFromLS("layouts");
    return savedLayouts?.layouts || generateInitialLayouts();
  });
  useEffect(() => {
    saveToLS({ layouts });
  }, [layouts]);

  const handleLayoutChange = (sectionId, newChildLayouts) => {
    setLayouts(newChildLayouts);
    // console.log('Received new child layout:', newChildLayouts);
    handleChild(sectionId, newChildLayouts);
    // // We need to update both the parent layout and the child layouts.
    // const updatedLayouts = layouts.lg.map((section) => {
    //   if (section.i === sectionId) {
    //     return {
    //       ...section,
    //       children: newChildLayouts,
    //     };
    //   }
    //   return section;  // Keep other sections unchanged
    // });

    // // Now update the parent layout and children in the state
    // setLayouts((prevLayouts) => ({
    //   ...prevLayouts,
    //   lg: updatedLayouts,  // Update the lg layout with new parent + children layout
    // }));

    // Save the updated layouts to local storage
    saveToLS({ layouts: { lg: newChildLayouts } });
  };
  console.log("oo", layouts);
  const handleChild = (sectionId, newChildLayouts) => {
    const updatedLayouts = layouts.lg.map((section) => {
      if (section.i === sectionId) {
        return {
          ...section,
          children: newChildLayouts,
        };
      }
      return section;
    });

    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: updatedLayouts,
    }));
  };

  return (
    <>
      <h1>Grid with Nested Grid</h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={30}
        onLayoutChange={handleLayoutChange}
      >
        {layouts.lg.map((section) => (
          <div
            key={section.i}
            style={{ border: "2px solid #ccc" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3>{section.i}</h3>
            <NestedGrid
              sectionId={section.i}
              children={section.children}
              onLayoutChange={() => {
                // setTimeout(() => {
                  handleLayoutChange();
                // }, [3000]);
              }}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </>
  );
};

export default SampleGrid;
