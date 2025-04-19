import React, { useState } from 'react';
import './pipeline.css';

// 模拟数据
const initialDataSources = [
  { id: 1, name: '股票分钟级行情', type: 'market_data', config: { symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA'], timeframe: 'minute' }, status: 'connected' },
  { id: 2, name: '宏观经济指标', type: 'fundamental', config: { dataPoints: ['gdp', 'inflation_rate', 'interest_rates', 'unemployment'], updateFrequency: 'monthly' }, status: 'connected' },
  { id: 3, name: '交易量分析', type: 'market_data', config: { metrics: ['volume', 'turnover', 'vwap'], timeframe: 'daily' }, status: 'connected' },
  { id: 4, name: '波动率指标', type: 'market_data', config: { metrics: ['historical_volatility', 'implied_volatility', 'vix'], timeframe: 'daily' }, status: 'connected' },
  { id: 5, name: '社交媒体情绪', type: 'alternative', config: { source: 'social_media', metrics: ['sentiment', 'volume', 'topic_analysis'] }, status: 'disconnected' }
];

// 模拟全局状态
const globalDataState = {
  dataSources: [...initialDataSources]
};

export function DataModule() {
  const [dataSources, setDataSources] = useState(globalDataState.dataSources);
  const [selectedSource, setSelectedSource] = useState(null);
  const [activeTab, setActiveTab] = useState('sources');
  const [previewData, setPreviewData] = useState(null);

  // 添加数据源
  const addDataSource = () => {
    const newSource = {
      id: Date.now(),
      name: '新数据源',
      type: 'market_data',
      config: { 
        symbols: ['SPY'], 
        timeframe: 'daily' 
      },
      status: 'disconnected'
    };
    
    const updatedSources = [...dataSources, newSource];
    setDataSources(updatedSources);
    globalDataState.dataSources = updatedSources;
    setSelectedSource(newSource);
    setActiveTab('config');
  };

  // 保存数据源
  const saveDataSource = (updatedSource) => {
    const updatedSources = dataSources.map(src => 
      src.id === updatedSource.id ? updatedSource : src
    );
    setDataSources(updatedSources);
    globalDataState.dataSources = updatedSources;
    setSelectedSource(updatedSource);
  };

  // 删除数据源
  const deleteDataSource = (id) => {
    const updatedSources = dataSources.filter(src => src.id !== id);
    setDataSources(updatedSources);
    globalDataState.dataSources = updatedSources;
    
    if (selectedSource && selectedSource.id === id) {
      setSelectedSource(null);
      setActiveTab('sources');
    }
  };

  // 预览数据
  const previewDataSource = (source) => {
    // 生成模拟预览数据
    const mockData = generateMockData(source);
    setPreviewData(mockData);
    setSelectedSource(source);
    setActiveTab('preview');
  };

  // 连接/断开数据源
  const toggleConnection = (source) => {
    const updatedSource = {
      ...source,
      status: source.status === 'connected' ? 'disconnected' : 'connected'
    };
    saveDataSource(updatedSource);
  };

  return (
    <div className="pipeline-module">
      <div className="module-toolbar">
        <div className="toolbar-tabs">
          <button 
            className={`toolbar-tab ${activeTab === 'sources' ? 'active' : ''}`}
            onClick={() => setActiveTab('sources')}
          >
            数据源
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => selectedSource && setActiveTab('config')}
            disabled={!selectedSource}
          >
            配置
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => selectedSource && setActiveTab('preview')}
            disabled={!selectedSource}
          >
            数据预览
          </button>
        </div>
        <div className="toolbar-spacer"></div>
        <button className="btn btn-primary" onClick={addDataSource}>
          添加数据源
        </button>
      </div>

      <div className="module-content">
        {activeTab === 'sources' && (
          <DataSourcesList 
            dataSources={dataSources} 
            onSelect={setSelectedSource}
            onDelete={deleteDataSource}
            onToggleConnection={toggleConnection}
            onPreview={previewDataSource}
          />
        )}
        
        {activeTab === 'config' && selectedSource && (
          <DataSourceConfig 
            dataSource={selectedSource}
            onSave={saveDataSource}
            onBack={() => setActiveTab('sources')}
          />
        )}
        
        {activeTab === 'preview' && selectedSource && (
          <DataPreview 
            dataSource={selectedSource}
            previewData={previewData}
            onBack={() => setActiveTab('sources')}
          />
        )}
      </div>
    </div>
  );
}

// 数据源列表组件
function DataSourcesList({ dataSources, onSelect, onDelete, onToggleConnection, onPreview }) {
  if (dataSources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray mb-3">还没有配置任何数据源</p>
        <p className="text-sm text-gray">点击"添加数据源"按钮开始配置</p>
      </div>
    );
  }

  return (
    <div className="item-list fade-in">
      {dataSources.map(source => (
        <div key={source.id} className="list-item">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-md font-medium">{source.name}</h3>
              <span className="text-sm text-gray">{getDataTypeLabel(source.type)}</span>
            </div>
            <StatusBadge status={source.status} />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {source.type === 'market_data' && source.config.symbols && 
              source.config.symbols.map(symbol => (
                <span key={symbol} className="tag tag-primary">{symbol}</span>
              ))
            }
          </div>
          
          <div className="flex gap-2 justify-end">
            <button 
              className={`btn btn-sm ${source.status === 'connected' ? 'btn-secondary' : 'btn-success'}`} 
              onClick={() => onToggleConnection(source)}
            >
              {source.status === 'connected' ? '断开' : '连接'}
            </button>
            <button 
              className="btn btn-sm btn-secondary" 
              onClick={() => onPreview(source)}
            >
              预览
            </button>
            <button 
              className="btn btn-sm btn-primary" 
              onClick={() => onSelect(source)}
            >
              配置
            </button>
            <button 
              className="btn btn-sm btn-danger" 
              onClick={() => onDelete(source.id)}
            >
              删除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// 数据源配置组件
function DataSourceConfig({ dataSource, onSave, onBack }) {
  const [editingSource, setEditingSource] = useState({ ...dataSource });
  const [symbols, setSymbols] = useState(
    editingSource.config.symbols ? editingSource.config.symbols.join(', ') : ''
  );
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingSource(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setEditingSource(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [name]: value
      }
    }));
  };
  
  const handleSymbolsChange = (e) => {
    const value = e.target.value;
    setSymbols(value);
    
    // 将逗号分隔的符号转换为数组
    const symbolsArray = value.split(',').map(s => s.trim()).filter(s => s);
    
    setEditingSource(prev => ({
      ...prev,
      config: {
        ...prev.config,
        symbols: symbolsArray
      }
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editingSource);
  };

  return (
    <div className="fade-in">
      <button 
        className="btn btn-secondary mb-4" 
        onClick={onBack}
      >
        返回列表
      </button>
      
      <form onSubmit={handleSubmit}>
        <div className="pipeline-card">
          <div className="pipeline-card-content">
            <div className="field-row">
              <label>数据源名称</label>
              <div className="field-input">
                <input
                  type="text"
                  name="name"
                  value={editingSource.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="field-row">
              <label>数据类型</label>
              <div className="field-input">
                <select
                  name="type"
                  value={editingSource.type}
                  onChange={handleChange}
                >
                  <option value="market_data">市场数据</option>
                  <option value="fundamental">基本面数据</option>
                  <option value="alternative">另类数据</option>
                </select>
              </div>
            </div>
            
            {editingSource.type === 'market_data' && (
              <>
                <div className="field-row">
                  <label>股票代码</label>
                  <div className="field-input">
                    <input
                      type="text"
                      name="symbols"
                      value={symbols}
                      onChange={handleSymbolsChange}
                      placeholder="用逗号分隔多个股票代码"
                    />
                    <small className="text-gray text-xs">输入多个代码用逗号分隔，如: AAPL, MSFT, GOOGL</small>
                  </div>
                </div>
                
                <div className="field-row">
                  <label>时间周期</label>
                  <div className="field-input">
                    <select
                      name="timeframe"
                      value={editingSource.config.timeframe}
                      onChange={handleConfigChange}
                    >
                      <option value="1min">1分钟</option>
                      <option value="5min">5分钟</option>
                      <option value="15min">15分钟</option>
                      <option value="30min">30分钟</option>
                      <option value="60min">1小时</option>
                      <option value="daily">日线</option>
                      <option value="weekly">周线</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            
            {editingSource.type === 'fundamental' && (
              <div className="field-row">
                <label>更新频率</label>
                <div className="field-input">
                  <select
                    name="updateFrequency"
                    value={editingSource.config.updateFrequency || 'daily'}
                    onChange={handleConfigChange}
                  >
                    <option value="daily">每日</option>
                    <option value="weekly">每周</option>
                    <option value="monthly">每月</option>
                    <option value="quarterly">每季度</option>
                  </select>
                </div>
              </div>
            )}
            
            {editingSource.type === 'alternative' && (
              <div className="field-row">
                <label>数据来源</label>
                <div className="field-input">
                  <select
                    name="source"
                    value={editingSource.config.source || 'social_media'}
                    onChange={handleConfigChange}
                  >
                    <option value="social_media">社交媒体</option>
                    <option value="web_traffic">网站流量</option>
                    <option value="satellite">卫星图像</option>
                    <option value="geolocation">地理位置</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button type="submit" className="btn btn-primary">
            保存配置
          </button>
        </div>
      </form>
    </div>
  );
}

// 数据预览组件
function DataPreview({ dataSource, previewData, onBack }) {
  if (!previewData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray">加载数据中...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-4">
        <button 
          className="btn btn-secondary" 
          onClick={onBack}
        >
          返回列表
        </button>
        <h3>{dataSource.name} - 数据预览</h3>
      </div>
      
      <div className="pipeline-card">
        <div className="pipeline-card-content">
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  {previewData.columns.map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.data.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// 状态标签组件
function StatusBadge({ status }) {
  if (status === 'connected') {
    return <span className="tag tag-success">已连接</span>;
  } else {
    return <span className="tag tag-error">未连接</span>;
  }
}

// 辅助函数
function getDataTypeLabel(type) {
  switch (type) {
    case 'market_data': return '市场数据';
    case 'fundamental': return '基本面数据';
    case 'alternative': return '另类数据';
    default: return type;
  }
}

// 生成模拟数据
function generateMockData(source) {
  let columns = ['日期'];
  let data = [];
  
  if (source.type === 'market_data') {
    columns = ['日期', '代码', '开盘价', '最高价', '最低价', '收盘价', '成交量'];
    
    const symbols = source.config.symbols || ['SPY'];
    const today = new Date();
    
    // 生成过去5天的数据
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      for (const symbol of symbols) {
        const basePrice = 100 + Math.random() * 100;
        const open = basePrice;
        const high = basePrice * (1 + Math.random() * 0.02);
        const low = basePrice * (1 - Math.random() * 0.02);
        const close = basePrice * (1 + (Math.random() - 0.5) * 0.01);
        const volume = Math.floor(Math.random() * 1000000);
        
        data.push([
          dateStr, 
          symbol, 
          open.toFixed(2), 
          high.toFixed(2), 
          low.toFixed(2), 
          close.toFixed(2), 
          volume.toLocaleString()
        ]);
      }
    }
  } else if (source.type === 'fundamental') {
    columns = ['代码', '名称', 'EPS', '收入 (百万)', '市盈率', '股息收益率'];
    
    data = [
      ['AAPL', '苹果公司', '6.48', '394,328', '28.4', '0.50%'],
      ['MSFT', '微软', '10.31', '204,090', '36.1', '0.73%'],
      ['GOOGL', '谷歌', '5.80', '282,836', '25.1', '0%'],
      ['AMZN', '亚马逊', '2.66', '513,983', '59.7', '0%'],
      ['FB', 'Meta平台', '14.05', '116,609', '17.2', '0%'],
    ];
  } else if (source.type === 'alternative') {
    if (source.config.source === 'social_media') {
      columns = ['日期', '代码', '情绪得分', '提及量', '正面比例', '负面比例'];
      
      const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB'];
      const today = new Date();
      
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        for (const symbol of symbols.slice(0, 2)) {
          const sentiment = (Math.random() * 2 - 1).toFixed(2);
          const volume = Math.floor(Math.random() * 10000);
          const positive = (Math.random() * 100).toFixed(1) + '%';
          const negative = (Math.random() * 100).toFixed(1) + '%';
          
          data.push([dateStr, symbol, sentiment, volume, positive, negative]);
        }
      }
    }
  }
  
  return { columns, data };
}
