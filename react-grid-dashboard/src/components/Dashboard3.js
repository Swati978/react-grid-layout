import React, { useState, useCallback } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
//latest code
const MinMaxLayout = ({
  isDraggable = true,
  isResizable = true,
  items = 7,
  rowHeight = 20,
  onLayoutChange = () => {},
  cols = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 },
}) => {
  // State for layouts
  
  // Generate responsive layouts
  const generateLayouts = useCallback(() => {
    const width = { lg: 4, md: 4, sm: 12, xs: 12, xxs: 12 };
    const cols = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 };
    const itemsArray = Array.from({ length: items }, (_, i) => i);
    const breakpoints = Object.keys(width);

    // Dynamic layout generation for each breakpoint
    const generatedLayouts = breakpoints.reduce((acc, breakpoint) => {
      const colWidth = width[breakpoint];
      const colCount = cols[breakpoint];
      acc[breakpoint] = itemsArray.map((i) => {
        const multiplier = i === 5 || i === 7 ? 0 : i === 6 || i === 8 ? 4 : i;
        const x = (multiplier * colWidth) % colCount;
        const h = i === 2 ? 12 : 4;

        if (i === 7 || i === 9) {
          return {
            x,
            y: 0,
            w: colWidth * 2,
            h: i === 9 ? 10 : h,
            i: String(i),
          };
        }

        if (i === 8) {
          return {
            x: 8,
            y: 0,
            w: colWidth,
            h: 12,
            i: String(i),
          };
        }

        return {
          x,
          y: 0,
          w: colWidth,
          h,
          i: String(i),
        };
      });
      return acc;
    }, {});

    console.log("Generated Layouts:", generatedLayouts);
    return generatedLayouts;
  }, [items]);
  const [layouts, setLayouts] = useState(generateLayouts());

  // Handle layout resize constraints
  const onResize = useCallback((layout, oldLayoutItem, layoutItem, placeholder) => {
    if (layoutItem.h < 3 && layoutItem.w > 2) {
      layoutItem.w = 2;
      placeholder.w = 2;
    }
    if (layoutItem.h >= 3 && layoutItem.w < 2) {
      layoutItem.w = 2;
      placeholder.w = 2;
    }
  }, []);

  // Generate widgets for the grid
  const renderWidget = useCallback(() => {
    return Array.from({ length: items }).map((_, i) => (
      <div
        key={i}
        style={{
          border: "2px solid #ccc",
          borderRadius: "10px",
          marginTop: "16px",
          marginRight: "14.74px",
        }}
      >
        <span className="text">{i}</span>
      </div>
    ));
  }, [items]);

  // Handle layout changes
  const handleLayoutChange = useCallback(
    (layout) => {
      setLayouts(layout);
      onLayoutChange(layout);
    },
    [onLayoutChange]
  );

  return (
    <>
      <h1>Section 1</h1>
      <ResponsiveReactGridLayout
        isDraggable={isDraggable}
        isResizable={isResizable}
        rowHeight={rowHeight}
        autoSize={true}
        cols={cols}
        layouts={layouts}
        // compactType={"horizontal"}
        onLayoutChange={handleLayoutChange}
        onResize={onResize}
      >
        {renderWidget()}
      </ResponsiveReactGridLayout>
    </>
  );
};

export default MinMaxLayout;