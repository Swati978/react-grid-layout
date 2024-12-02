  import React, { useState, useCallback } from "react";
  import { WidthProvider, Responsive } from "react-grid-layout";

  // Wrap it with WidthProvider to make it responsive
  const ResponsiveReactGridLayout = WidthProvider(Responsive);

  export const Dashboard2 = ({
    isDraggable = true,
    isResizable = true,
    rowHeight = 30,
    cols = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 },
  }) => {
    const generateChildLayouts = (sectionId, numItems) => {
      const width = { lg: 4, md: 4, sm: 12, xs: 12, xxs: 12 };
      const cols = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 };
      const itemsArray = Array.from({ length: numItems }, (_, i) => i);

      const breakpoints = Object.keys(width);
      const layouts = breakpoints.reduce((acc, breakpoint) => {
        const colWidth = width[breakpoint];
        const colCount = cols[breakpoint];

        acc[breakpoint] = itemsArray.map((i) => {
          const multiplier = i % 3; // Adjust widget positions
          const x = (multiplier * colWidth) % colCount;

          return {
            x,
            y: Math.floor(i / 3) * 4,
            w: colWidth,
            h: 4,
            i: `${sectionId}-${i}`,
          };
        });

        return acc;
      }, {});
      return layouts;
    };

    const [sectionLayouts, setSectionLayouts] = useState([
      {
        id: "1",
        i: "section1",
        x: 0,
        y: 0,
        w: 12,
        h: 12,
        childLayouts: generateChildLayouts("section1", 9),
      },
      {
        id: "2",
        i: "section2",
        x: 0,
        y: 12,
        w: 12,
        h: 4,
        childLayouts: generateChildLayouts("section2", 2),
      },
    ]);

    const onSectionLayoutChange = useCallback((layout) => {
      setSectionLayouts(layout);
    }, []);

    const renderWidget = (sectionId, numItems) => {
      return Array.from({ length: numItems }).map((_, i) => (
        <div
          key={`${sectionId}-${i}`}
          style={{
            border: "2px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="text">{i}</span>
        </div>
      ));
    };

    return (
      <ResponsiveReactGridLayout
        autoSize={true}
        isDraggable={isDraggable}
        isResizable={isResizable}
        rowHeight={rowHeight}
        cols={cols}
        layouts={sectionLayouts}
        onLayoutChange={onSectionLayoutChange}
        style={{ border: "2px solid #913933" }}
      >
        {sectionLayouts.map((section) => (
          <div key={section.i}>
            <h2>{section.i}</h2>
            {/* <div style={{ border: "2px solid #913933", marginBottom: "12px", height: "100%", width: "100%" }}> */}
              <ResponsiveReactGridLayout
                autoSize={true}
                isDraggable={isDraggable}
                isResizable={isResizable}
                rowHeight={rowHeight}
                cols={cols}
                style={{border: "2px solid #913933"}}
                layouts={section.childLayouts}
                onLayoutChange={(layout) => {
                  const updatedSectionLayouts = sectionLayouts.map((s) =>
                    s.id === section.id ? { ...s, childLayouts: layout } : s
                  );
                  setSectionLayouts(updatedSectionLayouts);
                }}
              >
                {/* {section.i === "section1"
                  ? renderWidget(section.i, 1)
                  : renderWidget(section.i, 2)} */}
                  {renderWidget(section.i, 1)}
              </ResponsiveReactGridLayout>
            {/* </div> */}
          </div>
        ))}
      </ResponsiveReactGridLayout>
    );
  };

  export default Dashboard2;
