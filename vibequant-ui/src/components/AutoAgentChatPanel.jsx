import React, { useState, useEffect, useRef } from 'react';

// 模拟工具调用返回内容，包括延迟时间和返回结果
const mockToolCalls = {
  // 数据模块工具
  FIND_MARKET_DATA: {
    delay: 1200,
    response: '已找到以下市场数据源：\n1. 股票分钟级行情 (更新频率: 分钟级)\n2. 交易量分析数据 (更新频率: 每日)\n3. 波动率指标 (更新频率: 每日)\n4. 宏观经济指标 (更新频率: 月度)'
  },
  CONFIG_MARKET_DATA: {
    delay: 800,
    response: '已配置股票分钟级行情作为主要数据源，包含以下资产: AAPL, MSFT, GOOGL, AMZN, META, NVDA, TSLA'
  },
  FIND_MOMENTUM_DATA: {
    delay: 1000,
    response: '已找到以下动量数据：\n1. 价格动量数据 (20/50/200日)\n2. 相对强弱指标 (RSI)\n3. 成交量加权平均价格 (VWAP)'
  },
  CONFIG_MOMENTUM_DATA: {
    delay: 800,
    response: '已将价格动量数据配置为动量反转策略的输入数据源，时间周期设置为：20日/50日'
  },
  
  // 因子模块工具
  CREATE_MOMENTUM_FACTOR: {
    delay: 1500,
    response: '创建短期动量因子：\n```python\ndef short_term_momentum(data, window=20):\n    # 计算价格变化率\n    price_change = data[\'close\'].pct_change(window)\n    # 计算动量指标\n    return price_change.rank(pct=True)\n```'
  },
  CREATE_REVERSAL_FACTOR: {
    delay: 1800,
    response: '创建价格反转因子：\n```python\ndef price_reversal(data, window=20):\n    # 计算均线偏离度\n    ma = data[\'close\'].rolling(window).mean()\n    deviation = (data[\'close\'] - ma) / ma\n    # 反转信号：价格过度偏离均线时可能出现反转\n    return -deviation.rank(pct=True)\n```'
  },
  TEST_FACTORS: {
    delay: 2200,
    response: '因子测试结果：\n- 短期动量因子：IC值0.15，IR值1.62，年化收益9.8%\n- 价格反转因子：IC值0.12，IR值1.33，年化收益7.5%\n- 因子相关性：-0.28 (负相关，非常适合组合)'
  },
  
  // 策略模块工具
  CREATE_STRATEGY: {
    delay: 2500,
    response: '创建动量反转策略代码：\n```python\nclass MomentumReversalStrategy(Strategy):\n    def __init__(self):\n        self.momentum_weight = 0.5  # 动量因子权重\n        self.reversal_weight = 0.5  # 反转因子权重\n        \n    def generate_signals(self, factors_data):\n        # 组合因子\n        combined_factor = (factors_data[\'short_term_momentum\'] * self.momentum_weight + \n                          factors_data[\'price_reversal\'] * self.reversal_weight)\n        \n        # 生成交易信号\n        long_signals = combined_factor > 0.8  # 选择排名前20%的资产做多\n        short_signals = combined_factor < 0.2  # 选择排名后20%的资产做空\n        \n        return {\'long\': long_signals, \'short\': short_signals}\n```'
  },
  SET_RISK_PARAMS: {
    delay: 1400,
    response: '设置风险参数：\n- 最大持仓比例：单一资产不超过组合的12%\n- 最大杠杆倍数：1.0倍\n- 止损设置：单笔亏损不超过3%\n- 波动率控制：投资组合波动率目标12%'
  },
  
  // 回测模块工具
  CONFIG_BACKTEST: {
    delay: 1200,
    response: '配置回测参数：\n- 回测周期：2023-01-01至2025-03-31\n- 初始资金：100万美元\n- 交易手续费：0.1%\n- 滑点模型：固定滑点5个基点'
  },
  RUN_BACKTEST: {
    delay: 3000,
    response: '回测进度：10%...',
    updates: [
      { delay: 1000, message: '回测进度：30%...' },
      { delay: 1000, message: '回测进度：55%...' },
      { delay: 1000, message: '回测进度：75%...' },
      { delay: 1000, message: '回测进度：100%，正在生成报告...' }
    ]
  },
  BACKTEST_RESULTS: {
    delay: 2000,
    response: '回测结果摘要：\n- 年化收益：38.6%\n- 最大回撤：8.2%\n- 夏普比率：1.86\n- 卡玛比率：4.70\n- 胜率：68%\n- 盈亏比：3.22\n- 年化波动率：12.3%'
  },
  GENERATE_REPORT: {
    delay: 1500,
    response: '已生成策略报告PDF，内容包括：\n- 策略概述与逻辑说明\n- 因子贡献度分析\n- 回测结果详情与图表\n- 不同市场环境下的表现\n- 风险指标分析\n- 优化建议'
  },
  
  // 实盘模块工具
  CONFIG_LIVE: {
    delay: 1800,
    response: '配置实盘参数：\n- 初始资金：100万美元\n- 交易频率：日级\n- 资产列表：已配置12支高流动性股票\n- 风控设置：单日最大亏损限制5%'
  },
  DEPLOY_STRATEGY: {
    delay: 2500,
    response: '策略部署进度：正在初始化交易环境...',
    updates: [
      { delay: 800, message: '策略部署进度：加载策略配置...' },
      { delay: 800, message: '策略部署进度：准备交易账户...' },
      { delay: 800, message: '策略部署进度：设置风控参数...' },
      { delay: 800, message: '策略部署进度：完成！已成功部署动量反转策略' }
    ]
  },
  LIVE_STATUS: {
    delay: 1200,
    response: '实盘状态：\n- 策略ID：MR-20250420-001\n- 运行状态：已激活\n- 首次交易时间：下一个交易时段（2025-04-21 09:30）\n- 监控面板：已配置，包含实时收益、持仓和信号监控'
  }
};

// 工具与pipeline模块的映射关系
const toolModuleMapping = {
  // 数据模块工具
  FIND_MARKET_DATA: 'data',
  CONFIG_MARKET_DATA: 'data',
  FIND_MOMENTUM_DATA: 'data',
  CONFIG_MOMENTUM_DATA: 'data',
  
  // 因子模块工具
  CREATE_MOMENTUM_FACTOR: 'factor',
  CREATE_REVERSAL_FACTOR: 'factor',
  TEST_FACTORS: 'factor',
  
  // 策略模块工具
  CREATE_STRATEGY: 'strategy',
  SET_RISK_PARAMS: 'strategy',
  
  // 回测模块工具
  CONFIG_BACKTEST: 'backtest',
  RUN_BACKTEST: 'backtest',
  BACKTEST_RESULTS: 'backtest',
  GENERATE_REPORT: 'backtest',
  
  // 实盘模块工具
  CONFIG_LIVE: 'live',
  DEPLOY_STRATEGY: 'live',
  LIVE_STATUS: 'live'
};

// 预定义的自动流程，按顺序执行
const autoAgentFlow = [
  { 
    sender: 'agent',
    message: '我将为您构建一个动量反转策略。首先，我需要查找合适的市场数据。',
    toolCall: 'FIND_MARKET_DATA'
  },
  { 
    sender: 'agent',
    message: '已找到可用的市场数据源。我将使用股票分钟级行情作为主要数据源。',
    toolCall: 'CONFIG_MARKET_DATA'
  },
  { 
    sender: 'agent',
    message: '接下来，我需要找到适合动量和反转分析的特定数据。',
    toolCall: 'FIND_MOMENTUM_DATA'
  },
  { 
    sender: 'agent',
    message: '我已配置了动量数据，现在开始创建策略所需的因子。首先是短期动量因子...',
    toolCall: 'CREATE_MOMENTUM_FACTOR'
  },
  { 
    sender: 'agent',
    message: '短期动量因子已创建。接下来创建价格反转因子...',
    toolCall: 'CREATE_REVERSAL_FACTOR'
  },
  { 
    sender: 'agent',
    message: '两个因子都已创建，现在进行因子测试，评估它们的预测能力...',
    toolCall: 'TEST_FACTORS'
  },
  { 
    sender: 'agent',
    message: '因子测试结果表明短期动量因子和价格反转因子都具有较好的预测能力，且相关性为负，非常适合组合。现在开始构建策略...',
    toolCall: 'CREATE_STRATEGY'
  },
  { 
    sender: 'agent',
    message: '策略代码已创建，现在设置风险控制参数...',
    toolCall: 'SET_RISK_PARAMS'
  },
  { 
    sender: 'agent',
    message: '策略已完成配置。接下来设置回测参数评估策略表现...',
    toolCall: 'CONFIG_BACKTEST'
  },
  { 
    sender: 'agent',
    message: '回测参数已配置，现在启动回测...',
    toolCall: 'RUN_BACKTEST'
  },
  { 
    sender: 'agent',
    message: '回测完成，以下是回测结果摘要：',
    toolCall: 'BACKTEST_RESULTS'
  },
  { 
    sender: 'agent',
    message: '回测结果显示策略表现优异，年化收益率38.6%，夏普比率1.86。我将为您生成详细报告...',
    toolCall: 'GENERATE_REPORT'
  },
  { 
    sender: 'agent',
    message: '策略报告已生成。根据回测结果，建议将此策略部署到实盘环境。现在开始配置实盘参数...',
    toolCall: 'CONFIG_LIVE',
    requiresUserConfirmation: true
  },
  { 
    sender: 'agent',
    message: '实盘参数已配置。是否确认部署动量反转策略到实盘环境？',
    toolCall: 'DEPLOY_STRATEGY',
    requiresUserConfirmation: true
  },
  { 
    sender: 'agent',
    message: '策略已成功部署，以下是实盘状态信息：',
    toolCall: 'LIVE_STATUS',
    requiresUserConfirmation: true
  },
  { 
    sender: 'agent',
    message: '恭喜！动量反转策略已成功创建并部署到实盘环境。您可以通过监控面板实时查看策略表现。您还需要我做什么？',
    toolCall: null
  }
];

function AutoAgentChatPanel({ initialMessages = [], onSendMessage, selectedNode = null, onModuleChange = null }) {
  const [messages, setMessages] = useState(initialMessages);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [autoFlowRunning, setAutoFlowRunning] = useState(false);
  const [currentFlowIndex, setCurrentFlowIndex] = useState(null);
  const [toolCallResult, setToolCallResult] = useState(null);
  const [userConfirmationNeeded, setUserConfirmationNeeded] = useState(false);
  const [debugState, setDebugState] = useState({
    lastStepIndex: null,
    lastToolCall: null
  });
  const [currentModule, setCurrentModule] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, toolCallResult, isTyping, userConfirmationNeeded]);

  // 自动开始演示流程（页面加载后）
  useEffect(() => {
    // 如果没有初始消息，自动开始演示
    if (messages.length === 0) {
      setTimeout(() => {
        startAutoFlow();
      }, 1500);
    }
  }, []);

  // 自动开始演示流程的函数
  const startAutoFlow = () => {
    // 添加默认的用户消息
    const defaultPrompt = "为我构建一个动量反转策略";
    const userMessage = { sender: 'user', message: defaultPrompt };
    setMessages(prev => [...prev, userMessage]);
    
    // 开始自动流程
    setAutoFlowRunning(true);
    setIsTyping(true);
    
    setTimeout(() => {
      // 开始自动流程的第一步
      setCurrentFlowIndex(0);
      setIsTyping(false);
    }, 1000);
  };

  // 处理用户消息提交
  const handleChatSubmit = (e) => {
    e.preventDefault();
    
    // 如果流程已经在运行，但不需要用户确认，或正在输入，则忽略
    if ((autoFlowRunning && !userConfirmationNeeded) || isTyping) return;
    
    // 检查是否是特定的启动命令，或在没有输入时使用默认命令
    const inputText = chatInput.trim() || "为我构建一个动量反转策略";
    
    // 添加用户消息
    const userMessage = { sender: 'user', message: inputText };
    setMessages(prev => [...prev, userMessage]);
    
    // 如果包含特定关键词则开始自动流程
    if (inputText.includes("构建") && inputText.includes("策略")) {
      setAutoFlowRunning(true);
      setIsTyping(true);
      setChatInput('');
      
      setTimeout(() => {
        setCurrentFlowIndex(0);
      }, 1000);
    } 
    // 检查是否是对需要用户确认步骤的响应
    else if (userConfirmationNeeded) {
      if (chatInput.toLowerCase().includes("是") || chatInput.toLowerCase().includes("确认") || chatInput.toLowerCase().includes("好") || !chatInput.trim()) {
        setUserConfirmationNeeded(false);
        setChatInput('');
      } else {
        // 用户拒绝，停止自动流程
        setAutoFlowRunning(false);
        setChatInput('');
        setIsTyping(false);
      }
    }
    // 对于其他消息，使用常规处理
    else {
      setChatInput('');
      setIsTyping(true);
      
      // 自动开始演示流程
      setAutoFlowRunning(true);
      setTimeout(() => {
        setCurrentFlowIndex(0);
        setIsTyping(false);
      }, 1000);
    }
  };

  // 继续自动流程
  const handleContinueFlow = () => {
    setUserConfirmationNeeded(false);
  };

  // 工具调用显示的动态过渡效果
  useEffect(() => {
    if (toolCallResult) {
      // 当有新的工具调用结果时，自动滚动到该区域
      const toolCallContainer = document.querySelector('.bento-tool-call-container');
      if (toolCallContainer) {
        setTimeout(() => {
          toolCallContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  }, [toolCallResult]);

  // 渲染工具调用结果
  const renderToolCallResult = () => {
    if (!toolCallResult) return null;
    
    return (
      <div className="bento-tool-call">
        <div className="bento-tool-call-header">
          <span className="bento-tool-call-icon">🔧</span>
          <span className="bento-tool-call-name">{toolCallResult.toolName}</span>
        </div>
        <div className="bento-tool-call-result">
          <pre>{toolCallResult.result}</pre>
        </div>
      </div>
    );
  };

  // 自动流程执行
  useEffect(() => {
    if (autoFlowRunning && currentFlowIndex !== null && currentFlowIndex < autoAgentFlow.length) {
      const currentStep = autoAgentFlow[currentFlowIndex];
      
      // 保存当前步骤信息用于调试
      setDebugState({
        lastStepIndex: currentFlowIndex,
        lastToolCall: currentStep.toolCall
      });
      
      // 如果需要用户确认，等待用户确认
      if (currentStep.requiresUserConfirmation && !userConfirmationNeeded) {
        setUserConfirmationNeeded(true);
        return;
      }

      setIsTyping(true);

      // 添加代理消息
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'agent', 
          message: currentStep.message 
        }]);
        
        // 如果有工具调用，执行工具调用
        if (currentStep.toolCall) {
          const toolCall = mockToolCalls[currentStep.toolCall];
          
          // 确保工具调用存在
          if (!toolCall) {
            console.error(`工具调用 ${currentStep.toolCall} 未找到`);
            setCurrentFlowIndex(prevIndex => prevIndex + 1);
            setIsTyping(false);
            return;
          }
          
          setTimeout(() => {
            // 设置工具调用结果
            setToolCallResult({
              toolName: currentStep.toolCall,
              result: toolCall.response
            });
            
            // 处理有更新的工具调用
            if (toolCall.updates && toolCall.updates.length > 0) {
              let totalDelay = 0;
              toolCall.updates.forEach((update, index) => {
                totalDelay += update.delay;
                setTimeout(() => {
                  setToolCallResult({
                    toolName: currentStep.toolCall,
                    result: update.message
                  });
                  
                  // 如果是最后一个更新，准备下一步
                  if (index === toolCall.updates.length - 1) {
                    setCurrentFlowIndex(prevIndex => prevIndex + 1);
                    setIsTyping(false);
                  }
                }, totalDelay);
              });
            } else {
              // 没有更新，直接进入下一步
              setTimeout(() => {
                setCurrentFlowIndex(prevIndex => prevIndex + 1);
                setIsTyping(false);
              }, 1000);
            }
          }, toolCall.delay || 1000);
        } else {
          // 没有工具调用，直接进入下一步
          setTimeout(() => {
            setCurrentFlowIndex(prevIndex => prevIndex + 1);
            setIsTyping(false);
          }, 1000);
        }
      }, 1000);
    }
  }, [autoFlowRunning, currentFlowIndex, userConfirmationNeeded]);

  // 根据工具调用结果切换pipeline模块
  useEffect(() => {
    if (toolCallResult) {
      const currentModule = toolModuleMapping[toolCallResult.toolName];
      if (currentModule) {
        setCurrentModule(currentModule);
        onModuleChange && onModuleChange(currentModule);
      }
    }
  }, [toolCallResult]);

  return (
    <div className="bento-chat">
      <div className="bento-chat-header">
        VibeQuant Assistant <span className="beta-badge">智能体演示</span>
      </div>
      
      <div className="bento-chat-container">
        <div className="bento-chat-messages">
          {messages.length === 0 && (
            <div className="bento-welcome-message">
              <p>您好！我是VibeQuant Assistant，可以帮助您构建、优化和监控量化交易策略。</p>
              <p>请输入<strong>"为我构建一个动量反转策略"</strong>来开始自动智能体演示。</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`bento-message ${msg.sender === 'user' ? 'user' : ''}`}
            >
              <div className={`bento-message-bubble ${msg.sender === 'user' ? 'user' : ''}`}>
                {msg.message}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="bento-message agent">
              <div className="bento-message-bubble agent typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {toolCallResult && (
          <div className="bento-tool-call-container">
            {renderToolCallResult()}
          </div>
        )}
      </div>
      
      <div className="bento-chat-footer">
        {userConfirmationNeeded && (
          <div className="bento-confirmation">
            <button onClick={handleContinueFlow} className="bento-confirm-btn">
              确认并继续
            </button>
          </div>
        )}
        
        <div className="bento-chat-input">
          <form onSubmit={handleChatSubmit} className="bento-chat-form">
            <input
              ref={inputRef}
              type="text"
              className="bento-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={autoFlowRunning ? "输入「是」确认继续..." : "点击发送按钮开始演示..."}
              disabled={isTyping}
            />
            <button type="submit" className="bento-button send-icon-button" disabled={isTyping && !userConfirmationNeeded}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AutoAgentChatPanel;
