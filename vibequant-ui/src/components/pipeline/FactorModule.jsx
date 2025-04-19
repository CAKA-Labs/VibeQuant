import React, { useState } from 'react';
import './pipeline.css';

// 模拟初始数据
const initialFactors = [
  { id: 1, name: "动量反转", code: "def calculate(data):\n    return data['close'].pct_change(20)", metrics: { sharpe: 1.2, ir: 0.8, drawdown: -0.15 }, status: "active" },
  { id: 2, name: "均值回归", code: "def calculate(data):\n    ma = data['close'].rolling(20).mean()\n    return (data['close'] - ma) / ma", metrics: { sharpe: 0.9, ir: 0.6, drawdown: -0.12 }, status: "testing" },
  { id: 3, name: "波动率因子", code: "def calculate(data):\n    return data['close'].rolling(30).std()", metrics: { sharpe: 0.7, ir: 0.5, drawdown: -0.10 }, status: "inactive" }
];

// 全局状态
const globalFactorState = {
  factors: [...initialFactors]
};

export function FactorModule() {
  const [factors, setFactors] = useState(globalFactorState.factors);
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  
  // 新增因子
  const addFactor = () => {
    const newFactor = {
      id: Date.now(),
      name: "新因子",
      code: "def calculate(data):\n    # 输入你的因子计算逻辑\n    return data['close'].pct_change(10)",
      metrics: { sharpe: 0, ir: 0, drawdown: 0 },
      status: "testing"
    };
    
    const updatedFactors = [...factors, newFactor];
    setFactors(updatedFactors);
    globalFactorState.factors = updatedFactors;
    setSelectedFactor(newFactor);
    setActiveTab('editor');
  };
  
  // 保存因子
  const saveFactor = (updatedFactor) => {
    const updatedFactors = factors.map(f => 
      f.id === updatedFactor.id ? updatedFactor : f
    );
    setFactors(updatedFactors);
    globalFactorState.factors = updatedFactors;
    setSelectedFactor(updatedFactor);
  };
  
  // 删除因子
  const deleteFactor = (id) => {
    const updatedFactors = factors.filter(f => f.id !== id);
    setFactors(updatedFactors);
    globalFactorState.factors = updatedFactors;
    
    if (selectedFactor && selectedFactor.id === id) {
      setSelectedFactor(null);
      setActiveTab('list');
    }
  };
  
  // 测试因子
  const testFactor = (factor) => {
    // 模拟测试，简单地更新metrics
    const updatedFactor = {
      ...factor,
      metrics: {
        sharpe: Number((Math.random() * 1.5).toFixed(2)),
        ir: Number((Math.random() * 1).toFixed(2)),
        drawdown: Number((-Math.random() * 0.2).toFixed(2))
      },
      status: "active"
    };
    saveFactor(updatedFactor);
  };

  return (
    <div className="pipeline-module">
      <div className="module-toolbar">
        <div className="toolbar-tabs">
          <button 
            className={`toolbar-tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            因子列表
          </button>
          <button 
            className={`toolbar-tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => selectedFactor && setActiveTab('editor')}
            disabled={!selectedFactor}
          >
            因子编辑
          </button>
        </div>
        <div className="toolbar-spacer"></div>
        <button className="btn btn-primary" onClick={addFactor}>
          添加因子
        </button>
      </div>

      <div className="module-content">
        {activeTab === 'list' ? (
          <FactorList 
            factors={factors} 
            onSelect={(factor) => {
              setSelectedFactor(factor);
              setActiveTab('editor');
            }}
            onDelete={deleteFactor}
            onTest={testFactor}
          />
        ) : (
          <FactorEditor 
            factor={selectedFactor} 
            onSave={saveFactor}
            onTest={testFactor}
            onBack={() => setActiveTab('list')}
          />
        )}
      </div>
    </div>
  );
}

// 因子列表组件
function FactorList({ factors, onSelect, onDelete, onTest }) {
  if (factors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray mb-3">还没有创建任何因子</p>
        <p className="text-sm text-gray">点击"添加因子"按钮开始创建</p>
      </div>
    );
  }

  return (
    <div className="factor-list fade-in">
      {factors.map(factor => (
        <FactorItem 
          key={factor.id} 
          factor={factor} 
          onSelect={onSelect}
          onDelete={onDelete}
          onTest={onTest}
        />
      ))}
    </div>
  );
}

// 单个因子组件
function FactorItem({ factor, onSelect, onDelete, onTest }) {
  const { id, name, metrics, status } = factor;
  
  const getStatusTag = () => {
    switch (status) {
      case 'active':
        return <span className="tag tag-success">已激活</span>;
      case 'testing':
        return <span className="tag tag-primary">测试中</span>;
      default:
        return <span className="tag">未激活</span>;
    }
  };

  return (
    <div className="list-item">
      <div className="factor-item-header">
        <h3 className="text-md font-medium">{name}</h3>
        {getStatusTag()}
      </div>
      
      <div className="factor-item-metrics">
        <div className="flex flex-col">
          <span className="text-xs text-gray">夏普比率</span>
          <span className={`text-md font-medium ${metrics.sharpe > 0 ? 'text-success' : 'text-error'}`}>
            {metrics.sharpe.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray">信息比率</span>
          <span className="text-md font-medium">{metrics.ir.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray">最大回撤</span>
          <span className="text-md font-medium text-error">{metrics.drawdown.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-3 justify-end">
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => onTest(factor)}
        >
          测试
        </button>
        <button 
          className="btn btn-primary btn-sm" 
          onClick={() => onSelect(factor)}
        >
          编辑
        </button>
        <button 
          className="btn btn-danger btn-sm" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          删除
        </button>
      </div>
    </div>
  );
}

// 因子编辑器组件
function FactorEditor({ factor, onSave, onTest, onBack }) {
  const [editingFactor, setEditingFactor] = useState({ ...factor });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingFactor(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMetricsChange = (e) => {
    const { name, value } = e.target;
    setEditingFactor(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [name]: parseFloat(value)
      }
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editingFactor);
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
              <label>因子名称</label>
              <div className="field-input">
                <input
                  type="text"
                  name="name"
                  value={editingFactor.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="field-row">
              <label>状态</label>
              <div className="field-input">
                <select
                  name="status"
                  value={editingFactor.status}
                  onChange={handleChange}
                >
                  <option value="active">已激活</option>
                  <option value="testing">测试中</option>
                  <option value="inactive">未激活</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pipeline-card">
          <div className="pipeline-card-content">
            <label className="block mb-2 font-medium">因子代码</label>
            <textarea
              className="code-editor"
              name="code"
              value={editingFactor.code}
              onChange={handleChange}
              spellCheck="false"
            />
          </div>
        </div>
        
        <div className="flex gap-3 justify-end mt-4">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => onTest(editingFactor)}
          >
            测试因子
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            保存因子
          </button>
        </div>
      </form>
    </div>
  );
}
