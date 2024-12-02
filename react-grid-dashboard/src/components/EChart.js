import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EChart = ({ option, style = { height: '100%', width: '100%' } }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    // Set the chart options
    chartInstance.setOption(option);

    // Clean up on unmount
    return () => {
      chartInstance.dispose();
    };
  }, [option]);

  return <div ref={chartRef} style={style} />;
};

export default EChart;
