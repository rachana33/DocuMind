
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SendIcon } from './Icons';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900/80 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-200">DocuMind Chat</h3>
        {isLoading && (
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 opacity-50">
            <SendIcon className="w-12 h-12 rotate-12" />
            <p className="text-center max-w-[200px]">Ask anything about the analyzed document.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask a question..."
            className="w-full bg-slate-800 text-slate-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-slate-700 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-lg transition-all"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
