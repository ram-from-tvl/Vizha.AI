'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTamboThread, useTamboThreadInput } from '@tambo-ai/react';

function ChatContent() {
  const [isClient, setIsClient] = useState(false);
  const { thread, isIdle, generationStage } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value?.trim() || isPending) return;
    await submit({ streamResponse: true });
  };

  const suggestedQueries = [
    "Show me upcoming hackathons",
    "What events are happening?",
    "Find AI/ML events",
    "Help me find teammates",
  ];

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">🤖 AI Event Assistant</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">🤖 AI Event Assistant</h1>
        <p className="text-gray-600">Chat with me to discover events, find teammates, and more!</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-4 overflow-y-auto mb-4">
        <div className="space-y-4">
          {/* Welcome message if no messages */}
          {(!thread?.messages || thread.messages.length === 0) && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 text-gray-900">
                <div className="whitespace-pre-wrap">
                  {`👋 Hi! I'm your AI Event Assistant powered by Tambo. I can help you:

• **Find Events** - Search hackathons, conferences, workshops, and meetups
• **Get Event Details** - View schedules, prizes, and participant info
• **Register** - Sign up for events you're interested in
• **Find Teammates** - Match with participants based on skills

Try asking me something like:
- "Show me upcoming hackathons"
- "What events are happening this month?"
- "Help me find teammates for the AI Challenge"`}
                </div>
              </div>
            </div>
          )}

          {/* Thread messages */}
          {thread?.messages?.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {/* For assistant messages with rendered components, only show brief intro text */}
                {message.role === 'assistant' && message.renderedComponent ? (
                  <>
                    {/* Show only non-JSON text content as intro */}
                    {Array.isArray(message.content) && message.content.map((part: any, i: number) => {
                      if (part.type === 'text' && part.text) {
                        // Filter out JSON arrays/objects and tool result data
                        const text = part.text.trim();
                        const isJson = text.startsWith('[') || text.startsWith('{');
                        const isToolData = text.includes('"id":') && text.includes('"title":');
                        
                        if (!isJson && !isToolData && text.length > 0 && text.length < 500) {
                          return <p key={i} className="whitespace-pre-wrap mb-2">{text}</p>;
                        }
                      }
                      return null;
                    })}
                    {/* Render the component */}
                    <div className="mt-2">{message.renderedComponent}</div>
                  </>
                ) : (
                  <>
                    {/* Regular text message without component */}
                    {Array.isArray(message.content) ? (
                      message.content.map((part: any, i: number) =>
                        part.type === 'text' ? (
                          <p key={i} className="whitespace-pre-wrap">{part.text}</p>
                        ) : null
                      )
                    ) : (
                      <p className="whitespace-pre-wrap">{String(message.content)}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          
          {isPending && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-bounce w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="animate-bounce w-2 h-2 bg-blue-600 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                  <div className="animate-bounce w-2 h-2 bg-blue-600 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Queries */}
      {(!thread?.messages || thread.messages.length === 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestedQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => setValue(query)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
            >
              {query}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask me about events, teammates, or anything else..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !value.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return <ChatContent />;
}
