import React, { useState, useEffect } from "react";
import RGL, { Responsive, WidthProvider } from "react-grid-layout";
import "./Grid.css";

const ReactGridLayout = WidthProvider(Responsive);

const MyLayout = () => {
  // Load sectionLayouts from localStorage or use default values
  const [sectionLayouts, setSectionLayouts] = useState(() => {
    const savedLayout = localStorage.getItem('sectionLayouts');
    return savedLayout ? JSON.parse(savedLayout) : [
      {
        i: "section1", x: 0, y: 0, w: 12, h: 12, minW: 2, minH: 3, moved: false, static: false, child: [[
          { i: "widget1", x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
          { i: "widget2", x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
        ]]
      },
      { i: "section2", x: 0, y: 5, w: 12, h: 12, minW: 2, minH: 3, moved: false, static: false },
    ];
  });

  //structure
// format
//   "layouts": {
//     "lg" : [
//       {
//         i: "section1", x: 0, y: 0, w: 12, h: 12, minW: 2, minH: 3, moved: false, static: false, child: [[
//           { i: "widget1", x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
//           { i: "widget2", x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
//         ]]
//       },
//       { i: "section2", x: 0, y: 5, w: 12, h: 12, minW: 2, minH: 3, moved: false, static: false, child: [[
//         { i: "widget1", x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
//         { i: "widget2", x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
//       ]] },
//     ];
//  "md" : [
//       {
//         i: "section1", x: 0, y: 0, w: 12, h: 12, minW: 2, minH: 3, moved: false, static: false, child: [[
//           { i: "widget1", x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
//           { i: "widget2", x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
//         ]]
//       },
//       { i: "section2", x: 0, y: 5, w: 12, h: 12, minW: 2, minH: 3, moved: false, static: false, child: [[
//         { i: "widget1", x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
//         { i: "widget2", x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
//       ]] },
//     ];
//   }
// }












// Load widgetLayouts from localStorage or use default values
const [widgetLayouts, setWidgetLayouts] = useState(() => {
  const savedWidgets = localStorage.getItem('widgetLayouts');
  return savedWidgets ? JSON.parse(savedWidgets) : {
    section1: [
      { i: "widget1", x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
      { i: "widget2", x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
    ],
    section2: [
      { i: "widget3", x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
      { i: "widget4", x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
    ],
  };
});

const [draggedWidget, setDraggedWidget] = useState(null);

const onDragStart = (widgetId, sourceSection) => {
  console.log("Drag Start:", { widgetId, sourceSection });
  setDraggedWidget({ widgetId, sourceSection });
};

const onDrop = (targetSection) => {
  if (draggedWidget) {
    const { widgetId, sourceSection } = draggedWidget;
    console.log("Drop:", { widgetId, sourceSection, targetSection });

    // Remove the widget from the source section
    const updatedSourceWidgets = widgetLayouts[sourceSection].filter(
      (widget) => widget.i !== widgetId
    );

    // Add the widget to the target section
    const widgetToMove = widgetLayouts[sourceSection].find(
      (widget) => widget.i === widgetId
    );
    console.log("Widget to move:", widgetToMove);

    let newX = 0;
    let newY = 0;
    if (widgetLayouts[targetSection].length > 0) {
      const lastWidget =
        widgetLayouts[targetSection][widgetLayouts[targetSection].length - 1];
      newX = lastWidget.x + lastWidget.w;
      newY = lastWidget.y;
      if (newX >= 12) {
        newX = 0;
        newY = lastWidget.y + lastWidget.h;
      }
    }

    const updatedTargetWidgets = [
      ...widgetLayouts[targetSection],
      { ...widgetToMove, x: newX, y: newY },
    ];

    console.log("Updated Source Widgets:", updatedSourceWidgets);
    console.log("Updated Target Widgets:", updatedTargetWidgets);

    // Update the state with the new widget layouts
    setWidgetLayouts((prevLayouts) => {
      const newLayouts = {
        ...prevLayouts,
        [sourceSection]: updatedSourceWidgets,
        [targetSection]: updatedTargetWidgets,
      };

      // Save updated widget layouts to localStorage
      localStorage.setItem('widgetLayouts', JSON.stringify(newLayouts));

      return newLayouts;
    });

    setDraggedWidget(null);
  }
};

const onWidgetLayoutChange = (section, layouts) => {
  console.log("Layout Change:", section, layouts);

  // Update widgetLayouts state
  setWidgetLayouts((prevLayouts) => {
    const newLayouts = {
      ...prevLayouts,
      [section]: layouts,
    };

    // Save updated widget layouts to localStorage
    localStorage.setItem('widgetLayouts', JSON.stringify(newLayouts));

    return newLayouts;
  });
};

const onSectionLayoutChange = (layouts) => {
  console.log("Section Layout Change:", layouts);
  setSectionLayouts(layouts);

  // Save updated section layouts to localStorage
  localStorage.setItem('sectionLayouts', JSON.stringify(layouts));
};

return (
  <div>
    <ReactGridLayout
      className="layout"
      layouts={{ lg: sectionLayouts }}  // Assign layouts in 'lg' as per requirement
      cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
      rowHeight={30}
      isDraggable
      isResizable
      onLayoutChange={onSectionLayoutChange}
      margin={[10, 10]}
    >
      {sectionLayouts.map((section) => (
        <div
          key={section.i}
          style={{ border: "2px solid #ccc", padding: "10px" }}
          onDrop={() => onDrop(section.i)}
          onDragOver={(e) => e.preventDefault()}
        >
          <h3>
            {section.i} (X: {section.x}, Y: {section.y}, W: {section.w}, H: {section.h})
          </h3>
          <ReactGridLayout
            className="nested-layout"
            layouts={{ lg: widgetLayouts[section.i] }}  // Handle widget layouts similarly
            cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
            rowHeight={30}
            isDraggable
            isResizable
            onLayoutChange={(layouts) => onWidgetLayoutChange(section.i, layouts)}
            onDragStart={(layout, oldItem, newItem, placeholder, e, element) => {
              e.stopPropagation();
              onDragStart(newItem.i, section.i);
            }}
            onDragStop={() => setDraggedWidget(null)}
          >
            {widgetLayouts[section.i].map((widget) => (
              <div
                key={widget.i}
                className="grid-item"
                style={{ border: "2px solid #ddd", background: "#f9f9f9", padding: "10px" }}
                onMouseDown={(e) => e.stopPropagation()}
                draggable
              >
                {/* Print the widget's coordinates */}
                <div>{`Widget: ${widget.i}`}</div>
                <div>{`X: ${widget.x}, Y: ${widget.y}, W: ${widget.w}, H: ${widget.h}`}</div>
              </div>
            ))}
          </ReactGridLayout>
        </div>
      ))}
    </ReactGridLayout>
  </div>
);
};

export default MyLayout;
