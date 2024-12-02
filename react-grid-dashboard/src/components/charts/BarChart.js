import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const BarChart = () => {
  const chartRef = useRef(null); // Reference to the chart DOM element

  useEffect(() => {
    const chartDom = chartRef.current; // Get the DOM element
    const myChart = echarts.init(chartDom); // Initialize the chart

    // Define the chart data and configuration
    const series = [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        stack: 'a',
        name: 'a',
      },
      {
        data: [10, 46, 64, '-', 0, '-', 0],
        type: 'bar',
        stack: 'a',
        name: 'b',
      },
      {
        data: [30, '-', 0, 20, 10, '-', 0],
        type: 'bar',
        stack: 'a',
        name: 'c',
      },
      {
        data: [30, '-', 0, 20, 10, '-', 0],
        type: 'bar',
        stack: 'b',
        name: 'd',
      },
      {
        data: [10, 20, 150, 0, '-', 50, 10],
        type: 'bar',
        stack: 'b',
        name: 'e',
      },
    ];

    const stackInfo = {};
    // Process stacking information
    for (let i = 0; i < series[0].data.length; ++i) {
      for (let j = 0; j < series.length; ++j) {
        const stackName = series[j].stack;
        if (!stackName) continue;
        if (!stackInfo[stackName]) {
          stackInfo[stackName] = { stackStart: [], stackEnd: [] };
        }
        const info = stackInfo[stackName];
        const data = series[j].data[i];
        if (data && data !== '-') {
          if (info.stackStart[i] == null) info.stackStart[i] = j;
          info.stackEnd[i] = j;
        }
      }
    }

    // Adjust item styles for stacking
    for (let i = 0; i < series.length; ++i) {
      const data = series[i].data;
      const info = stackInfo[series[i].stack];
      for (let j = 0; j < series[i].data.length; ++j) {
        const isEnd = info.stackEnd[j] === i;
        const topBorder = isEnd ? 20 : 0;
        const bottomBorder = 0;
        data[j] = {
          value: data[j],
          itemStyle: {
            borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder],
          },
        };
      }
    }

    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: series,
    };

    // Set the options for the chart
    myChart.setOption(option);

    // Cleanup function to dispose the chart when the component unmounts
    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array to only run once when the component mounts

  return (
    // The div where the chart will be rendered
    <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
  );
};

export default BarChart;
