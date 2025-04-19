import React, { useState, useEffect, useRef } from 'react';

function ChatPanel({ initialMessages = [], onSendMessage, selectedNode = null }) {
  const [messages, setMessages] = useState(initialMessages);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update messages if initialMessages prop changes (e.g., context switching)
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Focus input field when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 自动开始运行Agent (页面加载后)
  useEffect(() => {
    // 如果没有初始消息，自动触发Agent
    if (messages.length === 0 && initialMessages.length === 0) {
      setTimeout(() => {
        // 添加代理欢迎消息
        const agentMessage = { 
          sender: 'agent', 
          message: '您好！我是VibeQuant Assistant，可以帮助您构建、优化和监控量化交易策略。我能为您提供哪些帮助？' 
        };
        setMessages(prev => [...prev, agentMessage]);
      }, 1000);
    }
  }, []);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    
    // 如果有输入则使用用户输入，否则使用默认问题
    const userInputText = chatInput.trim() || "请帮我分析当前市场状况并提供潜在投资策略";
    
    // Add user message immediately
    const userMessage = { sender: 'user', message: userInputText };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and show typing indicator
    setChatInput('');
    setIsTyping(true);

    // Simulate agent processing time (would be replaced with actual agent calls)
    setTimeout(() => {
      // Call the callback function passed from the parent (PipelineView)
      if (onSendMessage) {
        onSendMessage(userInputText);
      }
      setIsTyping(false);
    }, 600);
  };

  // 处理发送空消息的情况（点击发送图标但无输入）
  const handleSendEmptyMessage = () => {
    const defaultQuestion = "请帮我分析当前市场状况并提供潜在投资策略";
    
    // Add user message immediately
    const userMessage = { sender: 'user', message: defaultQuestion };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and show typing indicator
    setChatInput('');
    setIsTyping(true);

    // Simulate agent processing time
    setTimeout(() => {
      if (onSendMessage) {
        onSendMessage(defaultQuestion);
      }
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="bento-chat">
      <div className="bento-chat-header">
        VibeQuant Assistant
      </div>
      
      <div className="bento-chat-messages">
        {messages.length === 0 && (
          <div className="bento-welcome-message">
            <p>您好！我是VibeQuant Assistant，可以帮助您构建、优化和监控量化交易策略。有什么我可以帮您的吗？</p>
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
      
      <div className="bento-chat-input">
        <form onSubmit={handleChatSubmit} className="bento-chat-form">
          <input
            ref={inputRef}
            type="text"
            className="bento-input"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="输入您的问题..."
          />
          <button type="submit" className="bento-button send-icon-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPanel;
