import React, { useState, useEffect } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS('layouts') || {};

const generateLayouts = ({ items = 2, cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 } }) => {
  const layouts = {};

  Object.keys(cols).forEach(breakpoint => {
    layouts[breakpoint] = new Array(items).fill(0).map((_, i) => ({
      i: `section${i + 1}`,
      x: (i * 4) % cols[breakpoint],
      y: Math.floor(i / (cols[breakpoint] / 4)) * 12,
      w: 12,
      h: 12,
      minW: 2,
      minH: 3,
      moved: false,
      static: false,
      child: [
        { i: `widget${i * 2 + 1}`, x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
        { i: `widget${i * 2 + 2}`, x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2, moved: false, static: false },
      ],
    }));
  });

  return layouts;
};

const ResponsiveLocalStorageLayout = () => {
  const [layouts, setLayouts] = useState(JSON.parse(JSON.stringify(originalLayouts)));

  useEffect(() => {
    const savedLayouts = getFromLS('layouts');
    if (savedLayouts) {
      setLayouts(savedLayouts);
    }
  }, []);

  useEffect(() => {
    saveToLS('layouts', layouts);
  }, [layouts]);

  const onLayoutChange = (layout, allLayouts) => {
    saveToLS('layouts', allLayouts);
    setLayouts(allLayouts);
  };

  const handleChildLayoutChange = (sectionId, childLayout) => {
    const newLayouts = { ...layouts };
    Object.keys(newLayouts).forEach(breakpoint => {
      newLayouts[breakpoint] = newLayouts[breakpoint].map(section =>
        section.i === sectionId ? { ...section, child: childLayout } : section
      );
    });
    setLayouts(newLayouts);
  };

  return (
    <div>
      <button onClick={() => setLayouts({})}>Reset Layout</button>
      <ResponsiveGridLayout
        className="layout"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        layouts={layouts}
        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
      >
        {layouts.lg.map(section => (
          <div key={section.i} data-grid={{ w: section.w, h: section.h, x: section.x, y: section.y, minW: section.minW, minH: section.minH }}>
            <h3>{section.i}</h3>
            <ResponsiveGridLayout
              className="nested-layout"
              cols={12}
              rowHeight={30}
              layouts={{ lg: section.child }}
              onLayoutChange={(layout, childLayouts) => handleChildLayoutChange(section.i, layout)}
            >
              {section.child.map(widget => (
                <div key={widget.i} data-grid={{ w: widget.w, h: widget.h, x: widget.x, y: widget.y, minW: widget.minW, minH: widget.minH }}>
                  {widget.i}
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8')) || {};
    } catch (e) {
      /* Ignore */
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem('rgl-8', JSON.stringify({ [key]: value }));
  }
}

export default ResponsiveLocalStorageLayout;
