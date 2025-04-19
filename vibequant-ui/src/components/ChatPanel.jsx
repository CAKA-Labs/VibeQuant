import React, { useState, useEffect, useRef } from 'react';

function ChatPanel({ initialMessages = [], onSendMessage, selectedNode = null }) {
  const [messages, setMessages] = useState(initialMessages);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef(null);

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

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Call the callback function passed from the parent (PipelineView)
    if (onSendMessage) {
      onSendMessage(chatInput);
    }

    // Optionally, immediately add the user's message to the UI for responsiveness
    // The parent component will likely update the messages prop anyway
    setMessages([...messages, { sender: 'user', message: chatInput }]);
    setChatInput('');
  };

  // Determine the header title based on the selected node
  const getPanelTitle = () => {
    if (!selectedNode) return "Agent Chat";
    const nodeName = selectedNode.charAt(0).toUpperCase() + selectedNode.slice(1);
    return `Agent Chat - ${nodeName}`;
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        {getPanelTitle()}
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
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-panel-input">
        <form onSubmit={handleChatSubmit}>
          <input
            type="text"
            placeholder={selectedNode ? `Ask about ${selectedNode}...` : "Ask a question..."}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPanel;
