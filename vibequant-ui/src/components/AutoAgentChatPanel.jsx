import React, { useState, useEffect, useRef } from 'react';

// 模拟工具调用返回内容，包括延迟时间和返回结果
const mockToolCalls = {
  // 数据模块工具
  FIND_SENTIMENT_DATA: {
    delay: 1200,
    response: '已找到以下情绪数据源：\n1. Twitter情绪API (情绪分析精度: 78%)\n2. 新闻头条情绪指标 (更新频率: 每日)\n3. Reddit讨论情绪指数 (覆盖资产: 主要加密货币和股票)'
  },
  CONFIG_SENTIMENT_DATA: {
    delay: 800,
    response: '已将Twitter情绪API配置为主要情绪数据源，包含以下情绪类别：积极、消极、中性'
  },
  FIND_VOLUME_DATA: {
    delay: 1000,
    response: '已找到以下交易量数据源：\n1. Alpha Vantage API (分钟级交易量数据)\n2. Yahoo Finance (日级交易量数据)\n3. Binance 实时交易量流 (秒级数据，仅加密货币)'
  },
  CONFIG_VOLUME_DATA: {
    delay: 800,
    response: '已将Alpha Vantage API配置为交易量数据源，时间粒度设置为：10分钟'
  },
  
  // 因子模块工具
  CREATE_SENTIMENT_FACTOR: {
    delay: 1500,
    response: '创建情绪动量因子：\n```python\ndef sentiment_momentum(data, window=5):\n    # 计算情绪变化率\n    sentiment_change = data[\'sentiment_score\'].pct_change(window)\n    # 计算情绪加速度\n    sentiment_accel = sentiment_change.diff()\n    # 归一化处理\n    return (sentiment_change * 0.7 + sentiment_accel * 0.3).rank(pct=True)\n```'
  },
  CREATE_VOLUME_FACTOR: {
    delay: 1800,
    response: '创建异常交易量因子：\n```python\ndef abnormal_volume(data, window=20):\n    # 计算交易量移动平均\n    volume_ma = data[\'volume\'].rolling(window).mean()\n    # 计算当前交易量偏离度\n    volume_dev = data[\'volume\'] / volume_ma - 1\n    # 交易量突增信号\n    return volume_dev.rank(pct=True)\n```'
  },
  TEST_FACTORS: {
    delay: 2200,
    response: '因子测试结果：\n- 情绪动量因子：IC值0.12，IR值1.38，年化收益8.6%\n- 异常交易量因子：IC值0.08，IR值0.94，年化收益6.2%\n- 因子相关性：0.22 (低相关，适合组合)'
  },
  
  // 策略模块工具
  CREATE_STRATEGY: {
    delay: 2500,
    response: '创建策略代码：\n```python\nclass SentimentVolumeStrategy(Strategy):\n    def __init__(self):\n        self.sentiment_weight = 0.6  # 情绪因子权重\n        self.volume_weight = 0.4     # 交易量因子权重\n        \n    def generate_signals(self, factors_data):\n        # 组合因子\n        combined_factor = (factors_data[\'sentiment_momentum\'] * self.sentiment_weight + \n                          factors_data[\'abnormal_volume\'] * self.volume_weight)\n        \n        # 生成交易信号\n        long_signals = combined_factor > 0.8  # 选择排名前20%的资产做多\n        short_signals = combined_factor < 0.2  # 选择排名后20%的资产做空\n        \n        return {\'long\': long_signals, \'short\': short_signals}\n```'
  },
  SET_RISK_PARAMS: {
    delay: 1400,
    response: '设置风险参数：\n- 最大持仓比例：单一资产不超过组合的10%\n- 最大杠杆倍数：1.5倍\n- 止损设置：单笔亏损不超过2%\n- 波动率控制：投资组合波动率目标13%'
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
    response: '回测结果摘要：\n- 年化收益：18.2%\n- 最大回撤：8.7%\n- 夏普比率：1.75\n- 卡玛比率：2.09\n- 胜率：64.3%\n- 盈亏比：2.1\n- 年化波动率：10.4%'
  },
  GENERATE_REPORT: {
    delay: 1500,
    response: '已生成详细回测报告，关键发现：\n1. 策略在市场波动性大的时期表现更好\n2. 情绪因子对收益贡献率约72%\n3. 交易量因子主要帮助降低回撤\n4. 最优的参数组合是情绪权重0.65，交易量权重0.35'
  },
  
  // 实盘模块工具
  CONFIG_LIVE: {
    delay: 1800,
    response: '配置实盘参数：\n- 初始资金：100万美元\n- 交易频率：10分钟\n- 资产列表：已配置10支高流动性股票\n- 风控设置：单日最大亏损限制3%'
  },
  DEPLOY_STRATEGY: {
    delay: 2500,
    response: '策略部署进度：正在初始化交易环境...',
    updates: [
      { delay: 800, message: '策略部署进度：加载策略配置...' },
      { delay: 800, message: '策略部署进度：连接数据源...' },
      { delay: 800, message: '策略部署进度：设置风控模块...' },
      { delay: 800, message: '策略部署进度：策略已成功部署！' }
    ]
  },
  LIVE_STATUS: {
    delay: 1200,
    response: '实盘状态：\n- 策略ID：SV-20250420-001\n- 运行状态：已激活\n- 首次交易时间：下一个交易时段（2025-04-21 09:30）\n- 监控面板：已配置，包含实时收益、持仓和信号监控'
  }
};

// 工具与pipeline模块的映射关系
const toolModuleMapping = {
  // 数据模块工具
  FIND_SENTIMENT_DATA: 'data',
  CONFIG_SENTIMENT_DATA: 'data',
  FIND_VOLUME_DATA: 'data',
  CONFIG_VOLUME_DATA: 'data',
  
  // 因子模块工具
  CREATE_SENTIMENT_FACTOR: 'factor',
  CREATE_VOLUME_FACTOR: 'factor',
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
    message: '我将为您构建一个基于情绪和交易量组合的量化策略。首先，我需要查找合适的情绪数据源。',
    toolCall: 'FIND_SENTIMENT_DATA'
  },
  { 
    sender: 'agent',
    message: '我将使用Twitter情绪API作为主要情绪数据源，现在配置数据接入。', 
    toolCall: 'CONFIG_SENTIMENT_DATA'
  },
  { 
    sender: 'agent',
    message: '接下来，我需要查找合适的交易量数据。', 
    toolCall: 'FIND_VOLUME_DATA'
  },
  { 
    sender: 'agent',
    message: '我将使用Alpha Vantage API获取10分钟级别的交易量数据，现在配置数据接入。', 
    toolCall: 'CONFIG_VOLUME_DATA'
  },
  { 
    sender: 'agent',
    message: '数据源已配置完成。现在开始设计情绪因子...', 
    toolCall: 'CREATE_SENTIMENT_FACTOR'
  },
  { 
    sender: 'agent',
    message: '情绪动量因子已创建。接下来设计交易量因子...', 
    toolCall: 'CREATE_VOLUME_FACTOR'
  },
  { 
    sender: 'agent',
    message: '两个因子已创建完成，现在进行因子测试评估它们的预测能力...', 
    toolCall: 'TEST_FACTORS'
  },
  { 
    sender: 'agent',
    message: '因子测试结果表明两个因子都具有预测能力且相关性较低，适合组合。现在开始构建策略...', 
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
    message: '回测参数已设置，开始运行回测...', 
    toolCall: 'RUN_BACKTEST'
  },
  { 
    sender: 'agent',
    message: '回测完成，以下是回测结果摘要：', 
    toolCall: 'BACKTEST_RESULTS'
  },
  { 
    sender: 'agent',
    message: '生成详细的回测分析报告...', 
    toolCall: 'GENERATE_REPORT'
  },
  { 
    sender: 'agent',
    message: '回测结果显示策略表现良好。是否要部署到实盘环境？',
    toolCall: null,
    waitForUserResponse: true,
    userResponseOptions: ["是", "否", "稍后再说"]
  },
  { 
    sender: 'agent',
    message: '正在配置实盘参数...', 
    toolCall: 'CONFIG_LIVE',
    requiresUserConfirmation: true
  },
  { 
    sender: 'agent',
    message: '开始部署策略到实盘环境...', 
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
    message: '恭喜！基于情绪和交易量组合的量化策略已成功创建并部署到实盘环境。您可以通过监控面板实时查看策略表现。您还需要我做什么？', 
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
    const defaultPrompt = "为我构建一个基于情绪和交易量组合的量化策略";
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
    const inputText = chatInput.trim() || "为我构建一个基于情绪和交易量组合的量化策略";
    
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

      // 如果等待用户响应，停下来
      if (currentStep.waitForUserResponse) {
        setIsTyping(false);
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
              <p>请输入<strong>"为我构建一个基于情绪和交易量组合的量化策略"</strong>来开始自动智能体演示。</p>
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
