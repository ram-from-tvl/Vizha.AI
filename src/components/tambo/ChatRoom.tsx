'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
}

interface ChatRoomProps {
  eventId: string;
  userId?: string;
  userName?: string;
}

export function ChatRoom({ eventId, userId, userName = 'Anonymous' }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    // In real app, set up WebSocket or polling
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [eventId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      // In real app, fetch from API
      // For demo, use mock data
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch messages');
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      userId: userId || 'anonymous',
      userName: userName,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // In real app, send to API/WebSocket
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-100 rounded mb-4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden flex flex-col" style={{ height: '500px' }}>
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h3 className="font-semibold">💬 Event Chat</h3>
        <p className="text-sm text-blue-100">Connect with other participants</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.userId === userId
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {message.userId !== userId && (
                  <p className={`text-xs font-medium mb-1 ${
                    message.userId === userId ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.userName}
                  </p>
                )}
                <p className={message.userId === userId ? 'text-white' : 'text-gray-800'}>
                  {message.content}
                </p>
                <p className={`text-xs mt-1 ${
                  message.userId === userId ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}