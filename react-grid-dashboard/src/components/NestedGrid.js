import React, { useState } from 'react';
import RGL, { Responsive, WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(Responsive);

const NestedGrid = () => {
  const [sectionLayouts, setSectionLayouts] = useState([
    { i: 'section1', x: 0, y: 0, w: 12, h: 8 },
    { i: 'section2', x: 0, y: 8, w: 12, h: 8 },
  ]);

  const [widgetLayouts, setWidgetLayouts] = useState({
    section1: [
      { i: 'Child widget1', x: 0, y: 0, w: 4, h: 4 },
      // { i: 'Child widget2', x: 4, y: 0, w: 4, h: 4 },
      // { i: 'Child widget3', x: 8, y: 0, w: 4, h: 4 },
    ],
    section2: [
      { i: 'Child widget4', x: 0, y: 0, w: 4, h: 4 },
      // { i: 'Child widget5', x: 4, y: 0, w: 4, h: 4 },
      // { i: 'Child widget6', x: 8, y: 0, w: 4, h: 4 },
    ],
  });

  const [draggingWidget, setDraggingWidget] = useState(null);

  const onWidgetLayoutChange = (section, layouts) => {
    setWidgetLayouts((prevLayouts) => ({
      ...prevLayouts,
      [section]: layouts,
    }));
  };

  const onWidgetDragStart = (widget, section) => {
    setDraggingWidget({ widget, section });
  };

  const onWidgetDragStop = (layout, oldItem, newItem, placeholder, e, element, section) => {
    if (draggingWidget) {
      setWidgetLayouts((prevLayouts) => {
        const newLayouts = { ...prevLayouts };
        // Remove from old section
        newLayouts[draggingWidget.section] = newLayouts[draggingWidget.section].filter(
          (item) => item.i !== draggingWidget.widget.i
        );
        // Add to new section
        newLayouts[section].push({ ...draggingWidget.widget, x: newItem.x, y: newItem.y });
        return newLayouts;
      });
      setDraggingWidget(null);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactGridLayout
        className="layout"
        layouts={{ lg: sectionLayouts }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={30}
        isDraggable
        isResizable
        onLayoutChange={(layouts) => {
          setSectionLayouts(layouts);
        }}
      >
        {sectionLayouts.map((section) => (
          <div key={section.i} style={{ border: '2px solid #ccc', padding: '10px', width: '100%', height: '100%' }}>
            <h3>{section.i}</h3>
            <ReactGridLayout
              className="nested-layout"
              layouts={{ lg: widgetLayouts[section.i] }}
              cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
              rowHeight={30}
              isDraggable
              isResizable
              onLayoutChange={(layouts) => onWidgetLayoutChange(section.i, layouts)}
              onDragStart={(layout, oldItem, newItem, placeholder, e, element) => {
                e.stopPropagation();
                onWidgetDragStart(newItem, section.i);
              }}
              onDragStop={(layout, oldItem, newItem, placeholder, e, element) => {
                e.stopPropagation();
                onWidgetDragStop(layout, oldItem, newItem, placeholder, e, element, section.i);
              }}
            >
              {widgetLayouts[section.i].map((widget) => (
                <div
                  key={widget.i}
                  style={{ border: '2px solid #ddd', background: '#f9f9f9', width: '100%', height: '100%', zIndex: '9999' }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {widget.i}
                </div>
              ))}
            </ReactGridLayout>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

export default NestedGrid;
