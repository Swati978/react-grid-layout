import React, { useState, useCallback } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";

// Wrap it with WidthProvider to make it responsive
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const LayoutComp = ({
    isDraggable = true,
    isResizable = true,
    items = 10,
    rowHeight = 30,
    onLayoutChange = () => { },
    cols = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 },
}) => {
    // Function to generate layouts for sections and their nested grids
    function generateLayouts() {
        const width = { lg: 4, md: 4, sm: 12, xs: 12, xxs: 12 };
        const cols = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 };
        const itemsArray = Array.from({ length: items }, (_, i) => i);

        const breakpoints = Object.keys(width);

        const layouts = breakpoints.reduce((acc, breakpoint) => {
            const colWidth = width[breakpoint];
            const colCount = cols[breakpoint];

            acc[breakpoint] = itemsArray.map((i) => {
                const multiplier = i === 5 || i === 7 ? 0 : i === 6 || i === 8 ? 4 : i;
                const x = (multiplier * colWidth) % colCount;

                const h = i === 2 ? 12 : 4;
                if (i === 7 || i === 9)
                    return {
                        x,
                        y: 4,
                        w: colWidth * 2,
                        h: i === 9 ? 10 : h,
                        i: String(i),
                    };
                if (i === 8) {
                    return {
                        x: 8,
                        y: 6,
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

        return layouts;
    }

    const [layouts, setLayouts] = useState(generateLayouts());

    const handleNestedLayoutChange = (layout, allLayouts) => {
        // Handle changes in the nested layout (if any specific logic is needed)
        console.log("Nested Layout Changed", layout);
        setLayouts(allLayouts);  // Update layouts
    };

    const renderWidget = (itemIndex) => {
        return (


            <ResponsiveReactGridLayout
                autoSize={true}
                isDraggable={isDraggable}
                isResizable={isResizable}
                rowHeight={rowHeight}
                cols={cols}
                layouts={generateLayouts}
            >
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                        backgroundColor: "#f9f9f9",
                    }}
                >
                    Widget {itemIndex}
                </div>
            </ResponsiveReactGridLayout>
        );
    };

    // Define section data
    const sections = [
        {
            title: "Section 1",
            layouts,
            items: 4,
        },
        {
            title: "Section 2",
            layouts,
            items: 3,
        },
    ];

    return (
        <>
            {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} style={{ marginBottom: "16px" }}>
                    <h2>{section.title}</h2>
                    <ResponsiveReactGridLayout
                        className="nested-grid"
                        layouts={section.layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 3, md: 3, sm: 2, xs: 3, xxs: 3 }}
                        rowHeight={rowHeight}
                        isDraggable={isDraggable}
                        isResizable={isResizable}
                        onLayoutChange={handleNestedLayoutChange}
                    >
                        {/* Render widgets inside the section grid */}
                        {section.layouts?.lg?.map((item) => (
                            <div
                                key={item.i}
                                style={{
                                    border: "1px solid #000",
                                    padding: "10px",
                                    backgroundColor: "#fff",
                                    borderRadius: "5px",
                                    cursor: "move",
                                }}
                                onMouseDown={(e) => e.stopPropagation()} // Prevent dragging of this div
                            >
                                {renderWidget(item.i)} {/* Render the widget inside the nested grid */}
                            </div>
                        ))}
                    </ResponsiveReactGridLayout>
                </div>
            ))}
        </>
    );
};


const generateInitialLayouts = () => ({
    lg: [
      {
        i: "section1",
        x: 0,
        y: 0,
        w: 12,
        h: 28,
        static: false,
        children: [
          { i: "item1", w: 1, h: 3, x: 0, y: 0, moved: false, static: false },
          { i: "item2", w: 1, h: 3, x: 1, y: 0, moved: false, static: false },
          { i: "item3", w: 1, h: 9, x: 2, y: 0, moved: false, static: false },
          { i: "item4", w: 1, h: 3, x: 0, y: 3, moved: false, static: false },
          { i: "item5", w: 1, h: 3, x: 1, y: 3, moved: false, static: false },
          { i: "item6", w: 1, h: 3, x: 0, y: 6, moved: false, static: false },
          { i: "item7", w: 1, h: 3, x: 1, y: 6, moved: false, static: false },
          { i: "item8", w: 2, h: 3, x: 0, y: 9, moved: false, static: false },
          { i: "item9", w: 1, h: 10, x: 2, y: 9, moved: false, static: false },
          { i: "item10", w: 2, h: 7, x: 0, y: 12, moved: false, static: false },
        ]
      },
      {
        i: "section2",
        x: 0,
        y: 0,
        w: 12,
        h: 3,
        static: false,
        children: [
          { i: "item1", w: 1, h: 1, x: 0, y: 0, moved: false, static: false },
          { i: "item2", w: 1, h: 1, x: 1, y: 0, moved: false, static: false },
          { i: "item3", w: 1, h: 1, x: 2, y: 0, moved: false, static: false }
        ]
      }
    ]
  });