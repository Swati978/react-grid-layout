import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChart = () => {
    const chartRef = useRef(null); // Reference for the chart DOM

    useEffect(() => {
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);

        const option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [150, 230, 224, 218, 135, 147, 260],
                    type: 'line',
                },
            ],
        };

        // Set the chart options
        myChart.setOption(option);

        ///this element will adjust the height and width of chart
        const resizeObserver = new ResizeObserver(() => {
            myChart.resize();
        });

        resizeObserver.observe(chartDom);

        return () => {
            myChart.dispose();
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{
                width: '100%',  
                height: '100%', 
            }}
        />
    );
};

export default LineChart;
