import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FiMessageCircle, FiX, FiSend, FiUser } from 'react-icons/fi';
import './ChatWidget.css';

const SOCKET_URL = 'http://localhost:5000';

const ChatWidget = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Only connect socket if chat is open or if we want to initialize it
    if (isOpen) {
      socketRef.current = io(SOCKET_URL, {
        withCredentials: true,
      });

      // Join general support room
      socketRef.current.emit('join_chat_support');

      // Listen for incoming messages
      socketRef.current.on('server_message', (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const payload = {
      sender: 'user',
      senderId: user?._id || 'guest-' + Math.random().toString(36).substr(2, 9),
      senderName: user ? user.name : 'Guest User',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    if (socketRef.current) {
      socketRef.current.emit('client_message', payload);
    } else {
      // Offline fallback
      setMessages((prev) => [...prev, { ...payload, offline: true }]);
    }
    setMessage('');
  };

  return (
    <div className="chat-widget-wrapper">
      {/* Floating Button */}
      {!isOpen && (
        <button className="chat-floating-btn" onClick={() => setIsOpen(true)}>
          <FiMessageCircle />
          <span className="chat-btn-tooltip">{t('nav.helpCenter') || 'Live Chat'}</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window card">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar"><FiUser /></div>
              <div>
                <h4>{t('nav.helpCenter') || 'Support Helpdesk'}</h4>
                <span className="chat-status">Online</span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <FiX />
            </button>
          </div>

          <div className="chat-messages">
            <div className="chat-msg system">
              <p>Welcome! How can we help you today?</p>
            </div>
            {messages.map((msg, idx) => {
              const isMe = msg.sender === 'user';
              return (
                <div key={idx} className={`chat-msg ${isMe ? 'sent' : 'received'}`}>
                  <div className="chat-msg-bubble">
                    {!isMe && <span className="chat-msg-author">{msg.senderName}</span>}
                    <p>{msg.message}</p>
                    <span className="chat-msg-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" className="chat-send-btn">
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
