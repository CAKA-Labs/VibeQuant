import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { CandlestickChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    DataZoomComponent,
    MarkLineComponent, 
    MarkPointComponent 
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register necessary components
echarts.use([
    CandlestickChart,
    GridComponent,
    TooltipComponent,
    DataZoomComponent,
    MarkLineComponent,
    MarkPointComponent,
    CanvasRenderer
]);

const FinancialChart = ({
    data,
    backgroundColor = '#FFFFFF', 
    textColor = '#333333', 
}) => {

    // Mock data if none is provided
    const sourceData = data || [
        { time: '2024-04-01', open: 170.34, high: 171.75, low: 169.88, close: 171.18 },
        { time: '2024-04-02', open: 171.23, high: 172.48, low: 170.95, close: 172.26 },
        { time: '2024-04-03', open: 172.05, high: 173.68, low: 171.80, close: 173.52 },
        { time: '2024-04-04', open: 173.70, high: 175.30, low: 173.25, close: 174.96 },
        { time: '2024-04-05', open: 174.85, high: 176.12, low: 174.20, close: 175.01 },
        { time: '2024-04-08', open: 175.10, high: 178.45, low: 174.90, close: 177.65 },
        { time: '2024-04-09', open: 177.80, high: 179.20, low: 176.50, close: 178.90 },
        { time: '2024-04-10', open: 178.75, high: 180.10, low: 177.60, close: 179.58 },
        { time: '2024-04-11', open: 179.65, high: 181.00, low: 178.80, close: 180.33 },
        { time: '2024-04-12', open: 180.40, high: 182.50, low: 180.15, close: 182.13 },
        { time: '2024-04-15', open: 182.00, high: 183.20, low: 181.50, close: 183.05 },
        { time: '2024-04-16', open: 183.10, high: 184.60, low: 182.80, close: 184.37 },
        { time: '2024-04-17', open: 184.50, high: 186.00, low: 184.10, close: 185.72 },
        { time: '2024-04-18', open: 185.80, high: 187.30, low: 185.20, close: 186.91 },
        { time: '2024-04-19', open: 186.75, high: 188.90, low: 186.50, close: 188.48 },
    ];

    // Transform data for ECharts: [open, close, low, high]
    const echartsData = sourceData.map(item => [item.open, item.close, item.low, item.high]);
    const dates = sourceData.map(item => item.time);

    const options = {
        backgroundColor: backgroundColor, 
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            // Format tooltip content if needed
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLine: { lineStyle: { color: textColor } }, 
            axisLabel: { color: textColor }, 
        },
        yAxis: {
            scale: true, 
            splitArea: { 
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { color: textColor },
            splitLine: { 
                lineStyle: {
                    color: 'rgba(197, 203, 206, 0.2)'
                }
            },
        },
        grid: { 
            left: '3%',
            right: '4%',
            bottom: '15%', 
            containLabel: true
        },
        dataZoom: [ 
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                start: 0,
                end: 100,
                bottom: '5%', 
                height: 20, 
                borderColor: '#ddd',
                fillerColor: 'rgba(167,183,204,0.4)',
                handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                textStyle: {
                    color: textColor
                }
            }
        ],
        series: [
            {
                type: 'candlestick',
                data: echartsData,
                itemStyle: {
                    color: '#26a69a', 
                    color0: '#ef5350', 
                    borderColor: '#26a69a',
                    borderColor0: '#ef5350',
                    // wick/shadow colors can be set here too if desired, often defaults are fine
                },
                // Optional: Add moving averages or other indicators here later
            }
        ]
    };

    return (
        <ReactECharts
            echarts={echarts} 
            option={options}
            style={{ height: '400px', width: '100%' }} 
            notMerge={true} 
            lazyUpdate={true} 
            theme={"light"} 
        />
    );
};

export default FinancialChart;
