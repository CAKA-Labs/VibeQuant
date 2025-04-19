import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    DataZoomComponent,
    MarkLineComponent, 
    MarkPointComponent,
    LegendComponent
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
    LegendComponent,
    CanvasRenderer
]);

const FinancialChart = ({
    data,
    height = 400,
    backgroundColor = '#FFFFFF', 
    textColor = '#3c4043', 
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

    // 颜色设计 - 专业金融图表配色
    const tiffanyBlue = '#0abab5';       // 主色 - Tiffany蓝
    const darkBlue = '#008080';          // 深蓝色
    const errorColor = '#ea4335';        // 错误色
    
    // 线条颜色方案
    const lineColor = isPositive ? tiffanyBlue : errorColor;
    const areaTopColor = isPositive ? 'rgba(10, 186, 181, 0.15)' : 'rgba(234, 67, 53, 0.15)';
    const areaBottomColor = isPositive ? 'rgba(10, 186, 181, 0.01)' : 'rgba(234, 67, 53, 0.01)';

    // 计算最大最小值，给图表一些空间
    const valueRange = Math.max(...values) - Math.min(...values);
    const minValue = Math.min(...values) - (valueRange * 0.08);
    const maxValue = Math.max(...values) + (valueRange * 0.05);
    
    // 计算均线 - 模拟7日均线
    const calculateMA = (period) => {
        const result = [];
        for (let i = 0; i < values.length; i++) {
            if (i < period - 1) {
                result.push('-');
                continue;
            }
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += values[i - j];
            }
            result.push(+(sum / period).toFixed(0));
        }
        return result;
    };
    
    const MA7 = calculateMA(7);
    
    // 交易量数据 - 生成模拟数据 (实际应由后端提供)
    const volumes = values.map((val, index) => {
        // 创建一些随机交易量，与价格变化相关
        const prevVal = index > 0 ? values[index - 1] : val;
        const change = Math.abs(val - prevVal);
        const baseVolume = val * 0.0005; // 基础交易量
        const randomFactor = 0.7 + Math.random() * 0.6; // 随机因子
        return Math.floor(baseVolume * randomFactor * (1 + change / val * 5));
    });
    
    // 图表配置
    const options = {
        backgroundColor: backgroundColor,
        animation: true,
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const valueItem = params[0];
                const maItem = params.length > 1 ? params[1] : null;
                
                const date = new Date(valueItem.name);
                const formattedDate = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`;
                
                const value = Number(valueItem.value).toLocaleString('zh-CN', {
                    style: 'currency',
                    currency: 'CNY',
                    minimumFractionDigits: 0
                });
                
                const changePercent = ((valueItem.value - firstValue) / firstValue * 100).toFixed(2);
                const dailyChange = (valueItem.value - (params[0].dataIndex > 0 ? values[params[0].dataIndex - 1] : valueItem.value)) || 0;
                const dailyChangePercent = (dailyChange / (params[0].dataIndex > 0 ? values[params[0].dataIndex - 1] : valueItem.value) * 100).toFixed(2);
                
                const changeColor = valueItem.value >= firstValue ? '#0abab5' : '#ea4335';
                const dailyChangeColor = dailyChange >= 0 ? '#0abab5' : '#ea4335';
                
                let result = `
                    <div style="padding: 0; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;">
                        <div style="font-size: 13px; color: #333; opacity: 0.85; margin-bottom: 8px;">${formattedDate}</div>
                        <div style="font-size: 16px; font-weight: 500; margin-bottom: 6px; color: #222;">${value}</div>
                        <div style="display: flex; justify-content: space-between;">
                            <div style="font-size: 12px; color: ${changeColor};">
                                <span>总涨跌: </span>
                                <span style="font-weight: 500;">${dailyChange >= 0 ? '+' : ''}${changePercent}%</span>
                            </div>
                            <div style="font-size: 12px; color: ${dailyChangeColor}; margin-left: 12px;">
                                <span>日涨跌: </span>
                                <span style="font-weight: 500;">${dailyChange >= 0 ? '+' : ''}${dailyChangePercent}%</span>
                            </div>
                        </div>
                `;
                
                if (maItem && maItem.value !== '-') {
                    const maValue = Number(maItem.value).toLocaleString('zh-CN', {
                        style: 'currency',
                        currency: 'CNY',
                        minimumFractionDigits: 0
                    });
                    
                    result += `
                        <div style="margin-top: 6px; font-size: 12px; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 8px; height: 2px; background: #8e9bab; margin-right: 4px;"></span>
                            <span style="color: #888;">MA7: </span>
                            <span style="margin-left: 3px; color: #555;">${maValue}</span>
                        </div>
                    `;
                }
                
                result += `</div>`;
                return result;
            },
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderWidth: 0,
            padding: [12, 16],
            textStyle: {
                color: textColor,
                fontSize: 13
            },
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 12,
            shadowOffsetX: 0,
            shadowOffsetY: 6,
            extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);'
        },
        axisPointer: {
            link: { xAxisIndex: 'all' },
            label: {
                backgroundColor: '#777'
            },
            lineStyle: {
                color: 'rgba(0, 0, 0, 0.2)',
                width: 1
            }
        },
        grid: [
            {
                left: '3%',
                right: '3%',
                top: '8%',
                height: '65%',
                containLabel: true
            },
            {
                left: '3%',
                right: '3%',
                top: '78%',
                height: '15%',
                containLabel: true
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: dates,
                boundaryGap: false,
                axisLine: { 
                    show: true, 
                    lineStyle: { color: 'rgba(0, 0, 0, 0.08)' } 
                },
                axisLabel: { 
                    color: 'rgba(0, 0, 0, 0.5)',
                    formatter: function(value) {
                        const date = new Date(value);
                        return `${date.getMonth()+1}/${date.getDate()}`;
                    },
                    fontSize: 11,
                    margin: 14,
                    interval: Math.ceil(dates.length / 7)
                },
                axisTick: { 
                    show: false 
                },
                splitLine: {
                    show: false
                },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 10,
                    label: {
                        show: false
                    }
                }
            },
            {
                type: 'category',
                gridIndex: 1,
                data: dates,
                boundaryGap: false,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            }
        ],
        yAxis: [
            {
                type: 'value',
                min: minValue,
                max: maxValue,
                position: 'right',
                axisLine: { 
                    show: false 
                },
                axisLabel: { 
                    color: 'rgba(0, 0, 0, 0.5)',
                    formatter: function(value) {
                        if (value >= 1000000) {
                            return '¥' + (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return '¥' + (value / 1000).toFixed(0) + 'K';
                        }
                        return '¥' + value;
                    },
                    fontSize: 11,
                    margin: 14,
                    align: 'right'
                },
                splitLine: { 
                    show: true,
                    lineStyle: {
                        color: 'rgba(0, 0, 0, 0.04)',
                        type: 'dashed',
                        dashOffset: 2
                    }
                },
                axisTick: {
                    show: false
                },
                splitNumber: 4,
            },
            {
                gridIndex: 1,
                position: 'right',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 0,
                end: 100,
                zoomLock: false,
                throttle: 50
            }
        ],
        series: [
            {
                name: '资产净值',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 0,
                showSymbol: false,
                sampling: 'lttb',
                animation: true,
                animationDuration: 1000,
                animationEasing: 'cubicOut',
                emphasis: {
                    focus: 'series',
                    scale: true,
                    itemStyle: {
                        color: lineColor,
                        borderColor: '#fff',
                        borderWidth: 2,
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                        shadowBlur: 12
                    }
                },
                itemStyle: {
                    color: lineColor,
                    borderWidth: 0
                },
                lineStyle: {
                    width: 2.5,
                    color: lineColor,
                    shadowColor: 'rgba(10, 186, 181, 0.1)',
                    shadowBlur: 0,
                    shadowOffsetY: 0,
                    cap: 'round',
                    join: 'round'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: areaTopColor
                        },
                        {
                            offset: 0.8,
                            color: areaBottomColor
                        },
                        {
                            offset: 1,
                            color: 'rgba(255, 255, 255, 0)'
                        }
                    ]),
                    origin: 'start'
                },
                markLine: {
                    silent: true,
                    symbol: ['none', 'none'],
                    lineStyle: {
                        color: isPositive ? 'rgba(10, 186, 181, 0.3)' : 'rgba(234, 67, 53, 0.3)',
                        type: 'solid',
                        width: 1
                    },
                    label: {
                        show: true,
                        position: 'start',
                        formatter: '起始价',
                        fontSize: 10,
                        color: 'rgba(0, 0, 0, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        padding: [2, 4],
                        borderRadius: 2
                    },
                    data: [
                        { 
                            name: '起始价',
                            yAxis: firstValue,
                            label: {
                                show: true
                            }
                        }
                    ]
                },
                data: values
            },
            {
                name: '7日均线',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'lttb',
                lineStyle: {
                    color: '#8e9bab',
                    width: 1.5,
                    type: 'solid'
                },
                emphasis: {
                    focus: 'series',
                    lineStyle: {
                        width: 2
                    }
                },
                z: 10,
                data: MA7
            },
            {
                name: '交易量',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: volumes,
                barWidth: '60%',
                barMaxWidth: 12,
                itemStyle: {
                    color: function(params) {
                        const i = params.dataIndex;
                        const currVal = values[i];
                        const prevVal = i > 0 ? values[i - 1] : currVal;
                        return currVal >= prevVal ? 'rgba(10, 186, 181, 0.4)' : 'rgba(234, 67, 53, 0.4)';
                    },
                    barBorderRadius: [2, 2, 0, 0]
                }
            }
        ]
    };

    return (
        <ReactECharts
            echarts={echarts}
            option={options}
            style={{ 
                height: `${height}px`, 
                width: '100%'
            }}
            notMerge={true}
            lazyUpdate={true}
            theme={"light"}
        />
    );
};

export default FinancialChart;
