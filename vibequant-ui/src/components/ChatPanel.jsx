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

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message immediately
    const userMessage = { sender: 'user', message: chatInput };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and show typing indicator
    setChatInput('');
    setIsTyping(true);

    // Simulate agent processing time (would be replaced with actual agent calls)
    setTimeout(() => {
      // Call the callback function passed from the parent (PipelineView)
      if (onSendMessage) {
        onSendMessage(chatInput);
      }
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="bento-chat">
      <div className="bento-chat-header">
        量化韵律助手
      </div>
      
      <div className="bento-chat-messages">
        {messages.length === 0 && (
          <div className="bento-welcome-message">
            <p>您好！我是量化韵律助手，可以帮助您构建、优化和监控量化交易策略。有什么我可以帮您的吗？</p>
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
          <button type="submit" className="bento-button" disabled={!chatInput.trim()}>
            发送
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPanel;
