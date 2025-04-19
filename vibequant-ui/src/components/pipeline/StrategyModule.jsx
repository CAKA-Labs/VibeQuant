import React, { useState } from 'react';
import './pipeline.css';

// 模拟数据
const initialStrategies = [
  { 
    id: 1, 
    name: "均值回归策略", 
    description: "基于价格均值回归原理的中长期策略",
    factorWeights: { 
      "动量因子": 0.3, 
      "波动率因子": 0.4, 
      "均值回归因子": 0.7 
    },
    riskSettings: {
      maxDrawdown: 0.2,
      positionLimit: 0.1,
      volatilityTarget: 0.15
    },
    status: "active"
  },
  { 
    id: 2, 
    name: "多因子动量策略", 
    description: "综合技术和基本面的多因子策略",
    factorWeights: { 
      "趋势因子": 0.5, 
      "成交量因子": 0.3, 
      "基本面因子": 0.4 
    },
    riskSettings: {
      maxDrawdown: 0.25,
      positionLimit: 0.15,
      volatilityTarget: 0.18
    },
    status: "testing"
  }
];

// 模拟全局状态
const globalStrategyState = {
  strategies: [...initialStrategies]
};

export function StrategyModule() {
  const [strategies, setStrategies] = useState(globalStrategyState.strategies);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  // 添加策略
  const addStrategy = () => {
    const newStrategy = {
      id: Date.now(),
      name: "新策略",
      description: "策略描述",
      factorWeights: {},
      riskSettings: {
        maxDrawdown: 0.2,
        positionLimit: 0.1,
        volatilityTarget: 0.15
      },
      status: "draft"
    };
    
    const updatedStrategies = [...strategies, newStrategy];
    setStrategies(updatedStrategies);
    globalStrategyState.strategies = updatedStrategies;
    setSelectedStrategy(newStrategy);
    setActiveTab('editor');
  };

  // 保存策略
  const saveStrategy = (updatedStrategy) => {
    const updatedStrategies = strategies.map(s => 
      s.id === updatedStrategy.id ? updatedStrategy : s
    );
    setStrategies(updatedStrategies);
    globalStrategyState.strategies = updatedStrategies;
    setSelectedStrategy(updatedStrategy);
  };

  // 删除策略
  const deleteStrategy = (id) => {
    const updatedStrategies = strategies.filter(s => s.id !== id);
    setStrategies(updatedStrategies);
    globalStrategyState.strategies = updatedStrategies;
    
    if (selectedStrategy && selectedStrategy.id === id) {
      setSelectedStrategy(null);
      setActiveTab('list');
    }
  };

  // 激活/停用策略
  const toggleStrategy = (strategy) => {
    const updatedStrategy = {
      ...strategy,
      status: strategy.status === 'active' ? 'inactive' : 'active'
    };
    saveStrategy(updatedStrategy);
  };

  return (
    <div className="pipeline-module">
      <div className="module-toolbar">
        <div className="toolbar-tabs">
          <button 
            className={`toolbar-tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            策略列表
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => selectedStrategy && setActiveTab('editor')}
            disabled={!selectedStrategy}
          >
            策略配置
          </button>
        </div>
        <div className="toolbar-spacer"></div>
        {activeTab === 'list' && <button className="btn-tiffany" onClick={addStrategy}>创建策略</button>}
      </div>

      <div className="module-content">
        {activeTab === 'list' && (
          <StrategiesList 
            strategies={strategies} 
            onSelect={setSelectedStrategy}
            onDelete={deleteStrategy}
            onToggle={toggleStrategy}
            onEdit={(strategy) => {
              setSelectedStrategy(strategy);
              setActiveTab('editor');
            }}
          />
        )}
        
        {activeTab === 'editor' && selectedStrategy && (
          <StrategyEditor 
            strategy={selectedStrategy}
            onSave={saveStrategy}
            onBack={() => setActiveTab('list')}
          />
        )}
      </div>
    </div>
  );
}

// 策略列表组件
function StrategiesList({ strategies, onSelect, onDelete, onToggle, onEdit }) {
  if (strategies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray mb-3">还没有创建任何策略</p>
        <p className="text-sm text-gray">点击"创建策略"按钮开始配置</p>
      </div>
    );
  }

  return (
    <div className="strategy-list fade-in">
      {strategies.map(strategy => (
        <StrategyItem 
          key={strategy.id} 
          strategy={strategy} 
          onSelect={onSelect}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

// 单个策略组件
function StrategyItem({ strategy, onSelect, onDelete, onToggle, onEdit }) {
  const { id, name, description, factorWeights, status } = strategy;
  
  const getStatusTag = () => {
    switch (status) {
      case 'active':
        return <span className="tag tag-success">已激活</span>;
      case 'testing':
        return <span className="tag tag-primary">测试中</span>;
      case 'draft':
        return <span className="tag">草稿</span>;
      default:
        return <span className="tag">未激活</span>;
    }
  };

  return (
    <div className="list-item">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-medium">{name}</h3>
        {getStatusTag()}
      </div>
      
      <p className="text-sm text-gray mb-3">{description}</p>
      
      <div className="mb-3">
        <div className="text-sm font-medium mb-1">因子权重</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(factorWeights).map(([factor, weight]) => (
            <span key={factor} className="tag">
              {factor}: {weight.toFixed(1)}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <button 
          className={`btn-tiffany ${status === 'active' ? 'btn-tiffany-danger' : ''}`} 
          onClick={() => onToggle(strategy)}
        >
          {status === 'active' ? '停用' : '激活'}
        </button>
        <button 
          className="btn-tiffany" 
          onClick={() => onEdit(strategy)}
        >
          编辑
        </button>
        <button 
          className="btn-tiffany-danger" 
          onClick={() => onDelete(id)}
        >
          删除
        </button>
      </div>
    </div>
  );
}

// 策略编辑器组件
function StrategyEditor({ strategy, onSave, onBack }) {
  const [editingStrategy, setEditingStrategy] = useState({ ...strategy });
  const [factorWeightKey, setFactorWeightKey] = useState('');
  const [factorWeightValue, setFactorWeightValue] = useState(0.5);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingStrategy(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRiskSettingChange = (e) => {
    const { name, value } = e.target;
    setEditingStrategy(prev => ({
      ...prev,
      riskSettings: {
        ...prev.riskSettings,
        [name]: parseFloat(value)
      }
    }));
  };
  
  const addFactorWeight = () => {
    if (!factorWeightKey.trim()) return;
    
    setEditingStrategy(prev => ({
      ...prev,
      factorWeights: {
        ...prev.factorWeights,
        [factorWeightKey]: factorWeightValue
      }
    }));
    
    setFactorWeightKey('');
    setFactorWeightValue(0.5);
  };
  
  const removeFactorWeight = (factor) => {
    const newFactorWeights = { ...editingStrategy.factorWeights };
    delete newFactorWeights[factor];
    
    setEditingStrategy(prev => ({
      ...prev,
      factorWeights: newFactorWeights
    }));
  };
  
  const updateFactorWeight = (factor, value) => {
    setEditingStrategy(prev => ({
      ...prev,
      factorWeights: {
        ...prev.factorWeights,
        [factor]: parseFloat(value)
      }
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editingStrategy);
  };

  return (
    <div className="fade-in">
      <button 
        className="btn-tiffany mb-4" 
        onClick={onBack}
      >
        返回列表
      </button>
      
      <form onSubmit={handleSubmit}>
        <div className="pipeline-card">
          <div className="pipeline-card-content">
            <div className="field-row">
              <label>策略名称</label>
              <div className="field-input">
                <input
                  type="text"
                  name="name"
                  value={editingStrategy.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="field-row">
              <label>策略描述</label>
              <div className="field-input">
                <textarea
                  name="description"
                  value={editingStrategy.description}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
            </div>
            
            <div className="field-row">
              <label>状态</label>
              <div className="field-input">
                <select
                  name="status"
                  value={editingStrategy.status}
                  onChange={handleChange}
                >
                  <option value="draft">草稿</option>
                  <option value="testing">测试中</option>
                  <option value="active">已激活</option>
                  <option value="inactive">未激活</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pipeline-card mt-4">
          <div className="pipeline-card-content">
            <h3 className="text-md font-medium mb-3">因子权重配置</h3>
            
            {Object.keys(editingStrategy.factorWeights).length > 0 ? (
              <div className="mb-4">
                {Object.entries(editingStrategy.factorWeights).map(([factor, weight]) => (
                  <div key={factor} className="weight-slider">
                    <div className="weight-slider-label">{factor}</div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={weight}
                      onChange={(e) => updateFactorWeight(factor, e.target.value)}
                      className="weight-slider-input"
                    />
                    <div className="weight-slider-value">{weight.toFixed(1)}</div>
                    <button
                      type="button"
                      className="btn-tiffany-danger"
                      onClick={() => removeFactorWeight(factor)}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray mb-3">暂无配置因子，请添加</p>
            )}
            
            <div className="field-row">
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="因子名称"
                  value={factorWeightKey}
                  onChange={(e) => setFactorWeightKey(e.target.value)}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={factorWeightValue}
                  onChange={(e) => setFactorWeightValue(parseFloat(e.target.value))}
                  style={{ width: '80px' }}
                />
                <button
                  type="button"
                  className="btn-tiffany"
                  onClick={addFactorWeight}
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pipeline-card mt-4">
          <div className="pipeline-card-content">
            <h3 className="text-md font-medium mb-3">风险控制设置</h3>
            
            <div className="field-row">
              <label>最大回撤限制</label>
              <div className="field-input">
                <input
                  type="number"
                  name="maxDrawdown"
                  min="0.05"
                  max="0.5"
                  step="0.01"
                  value={editingStrategy.riskSettings.maxDrawdown}
                  onChange={handleRiskSettingChange}
                />
                <small className="text-gray text-xs">最大允许的回撤比例，例如0.2表示20%</small>
              </div>
            </div>
            
            <div className="field-row">
              <label>单一持仓限制</label>
              <div className="field-input">
                <input
                  type="number"
                  name="positionLimit"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={editingStrategy.riskSettings.positionLimit}
                  onChange={handleRiskSettingChange}
                />
                <small className="text-gray text-xs">单一股票最大持仓比例，例如0.1表示10%</small>
              </div>
            </div>
            
            <div className="field-row">
              <label>波动率目标</label>
              <div className="field-input">
                <input
                  type="number"
                  name="volatilityTarget"
                  min="0.05"
                  max="0.5"
                  step="0.01"
                  value={editingStrategy.riskSettings.volatilityTarget}
                  onChange={handleRiskSettingChange}
                />
                <small className="text-gray text-xs">策略目标波动率，例如0.15表示15%</small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button 
            type="button"
            className="btn-tiffany"
            onClick={onBack}
          >
            取消
          </button>
          <button 
            type="submit"
            className="btn-tiffany"
          >
            保存策略
          </button>
        </div>
      </form>
    </div>
  );
}
