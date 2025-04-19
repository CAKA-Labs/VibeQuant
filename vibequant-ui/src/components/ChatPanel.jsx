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

  // Determine the header title based on the selected node
  const getPanelTitle = () => {
    if (!selectedNode) return "Agent Chat";
    const nodeName = selectedNode.charAt(0).toUpperCase() + selectedNode.slice(1);
    return `${nodeName} Agent`;
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <span>{getPanelTitle()}</span>
        <div className="chat-panel-actions">
          <button className="icon-button" title="Clear chat">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="chat-panel-messages">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`chat-message ${msg.sender === 'user' ? 'user' : 'agent'}`}
          >
            <div className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'agent'}`}>
              {msg.message}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message agent">
            <div className="chat-bubble agent typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-panel-input">
        <form onSubmit={handleChatSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder={selectedNode ? `Ask about ${selectedNode}...` : "Ask a question..."}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!chatInput.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" fill="currentColor"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPanel;
