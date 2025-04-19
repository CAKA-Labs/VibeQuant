import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
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
    LineChart,
    GridComponent,
    TooltipComponent,
    DataZoomComponent,
    MarkLineComponent,
    MarkPointComponent,
    CanvasRenderer
]);

const FinancialChart = ({
    data,
    height = 400,
    backgroundColor = '#FFFFFF', 
    textColor = '#333333', 
}) => {
    // Mock data if none is provided
    const defaultData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2025, 3, i + 1).toISOString().split('T')[0],
        value: 450000 + Math.floor(Math.random() * 15000) - 7500 + i * 1200
    }));
    
    const chartData = data || defaultData;
    
    // Extract dates and values
    const dates = chartData.map(item => item.date);
    const values = chartData.map(item => item.value);

    // Calculate percentage change
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const percentChange = ((lastValue - firstValue) / firstValue) * 100;
    const isPositive = percentChange >= 0;

    // Get min and max for better visualization
    const minValue = Math.min(...values) * 0.998;
    const maxValue = Math.max(...values) * 1.002;

    const options = {
        backgroundColor: backgroundColor,
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const data = params[0];
                return `${data.name}<br/>${data.marker}¥${data.value.toLocaleString()}`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dates,
            boundaryGap: false,
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { 
                color: textColor,
                formatter: function(value) {
                    // Format dates to be more readable
                    return value.substring(5); // Just show MM-DD
                }
            },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            min: minValue,
            max: maxValue,
            axisLine: { lineStyle: { color: textColor } },
            axisLabel: { 
                color: textColor,
                formatter: function(value) {
                    if (value >= 1000000) {
                        return '¥' + (value / 1000000).toFixed(1) + '百万';
                    } else if (value >= 1000) {
                        return '¥' + (value / 1000).toFixed(0) + '千';
                    }
                    return '¥' + value;
                }
            },
            splitLine: { 
                lineStyle: {
                    color: 'rgba(197, 203, 206, 0.2)'
                }
            },
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
                name: '资产',
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 1,
                sampling: 'lttb',
                itemStyle: {
                    color: isPositive ? '#26a69a' : '#ef5350'
                },
                lineStyle: {
                    width: 2,
                    color: isPositive ? '#26a69a' : '#ef5350'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: isPositive ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)'
                        },
                        {
                            offset: 1,
                            color: isPositive ? 'rgba(38, 166, 154, 0.05)' : 'rgba(239, 83, 80, 0.05)'
                        }
                    ])
                },
                data: values
            }
        ]
    };

    return (
        <ReactECharts
            echarts={echarts}
            option={options}
            style={{ height: `${height}px`, width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
            theme={"light"}
        />
    );
};

export default FinancialChart;
