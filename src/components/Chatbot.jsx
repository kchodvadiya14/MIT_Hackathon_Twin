import React, { useState, useEffect, useRef } from 'react';
import chatbotService from '../services/chatbotService';

const styles = {
  chatbotContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  chatButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#111827',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease'
  },
  chatWindow: {
    width: '350px',
    height: '500px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '12px',
    border: '1px solid #e5e7eb'
  },
  chatHeader: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc'
  },
  chatTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#111827'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px'
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  message: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: '1.4',
    wordWrap: 'break-word'
  },
  userMessage: {
    backgroundColor: '#111827',
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px'
  },
  botMessage: {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px'
  },
  messageTimestamp: {
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: '4px',
    textAlign: 'right'
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px'
  },
  suggestion: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '12px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  chatInput: {
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '8px'
  },
  input: {
    flex: 1,
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    padding: '10px 16px',
    fontSize: '14px',
    outline: 'none',
    resize: 'none'
  },
  sendButton: {
    backgroundColor: '#111827',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6b7280',
    fontSize: '14px'
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '16px',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px'
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#9ca3af',
    animation: 'typing 1.4s infinite ease-in-out'
  }
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = chatbotService.getWelcomeMessage();
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get bot response
      const botResponse = await chatbotService.processMessage(message);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        suggestions: ["How to use the app", "Web scraping features", "AI tools"]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message) => {
    const isUser = message.type === 'user';
    const messageStyle = {
      ...styles.message,
      ...(isUser ? styles.userMessage : styles.botMessage)
    };

    return (
      <div key={message.id} style={messageStyle}>
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        <div style={styles.messageTimestamp}>
          {formatTime(message.timestamp)}
        </div>
        {message.suggestions && !isUser && (
          <div style={styles.suggestions}>
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                style={styles.suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.chatbotContainer}>
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <h3 style={styles.chatTitle}>🤖 Hackathon Assistant</h3>
            <button
              style={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div style={styles.chatMessages}>
            {messages.map(renderMessage)}
            
            {isLoading && (
              <div style={styles.typingIndicator}>
                <div style={{ ...styles.dot, animationDelay: '0s' }}></div>
                <div style={{ ...styles.dot, animationDelay: '0.2s' }}></div>
                <div style={{ ...styles.dot, animationDelay: '0.4s' }}></div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} style={styles.chatInput}>
            <textarea
              ref={inputRef}
              style={styles.input}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about the app..."
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              style={styles.sendButton}
              disabled={isLoading || !inputValue.trim()}
            >
              ➤
            </button>
          </form>
        </div>
      )}
      
      <button
        style={{
          ...styles.chatButton,
          backgroundColor: isOpen ? '#6b7280' : '#111827'
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {isOpen ? '×' : '💬'}
      </button>
      
      <style>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Chatbot;
