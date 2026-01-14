
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { SendIcon, BrainIcon } from './Icons';

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
    <div className="flex flex-col h-[800px] bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-slate-700/50 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/10 rounded-xl">
            <BrainIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Contextual Chat</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Powered by Gemini 3 Flash</p>
          </div>
        </div>
        {isLoading && (
          <div className="flex gap-1.5 items-center bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">AI Thinking</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gradient-to-b from-transparent to-slate-900/50"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 opacity-50 px-8">
            <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center rotate-6">
              <SendIcon className="w-8 h-8 text-slate-500" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-bold text-slate-400">Knowledge Assistant Ready</p>
              <p className="text-xs max-w-[240px]">Ask specific questions about data points, dates, or complex clauses in the document.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div 
                className={`max-w-[92%] px-5 py-4 rounded-[1.5rem] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-none ring-1 ring-slate-700/30'
                }`}
              >
                {msg.role === 'model' ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:my-2 prose-headings:text-indigo-300 prose-ul:my-2 prose-li:my-1 prose-strong:text-white prose-strong:font-bold">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border-t border-slate-800/50">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Interrogate your document..."
            className="w-full bg-slate-800/50 text-slate-200 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 border border-slate-700/50 hover:border-slate-600 transition-all disabled:opacity-50 text-sm placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-600 mt-3 font-medium">Shift + Enter for multi-line</p>
      </form>
    </div>
  );
};

export default ChatInterface;
