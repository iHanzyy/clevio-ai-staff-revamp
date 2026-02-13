
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Send, RefreshCw, AlertCircle, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatWebSocket, Message } from './useChatWebSocket';
import { cn } from '@/lib/utils';

export default function TestChatInterface() {
  const { messages, status, sendMessage, reconnect, isLoading } = useChatWebSocket();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleSend = () => {
    if (!inputValue.trim() || status !== 'connected') return;
    sendMessage(inputValue);
    setInputValue('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full flex flex-col h-screen bg-slate-50 text-slate-900 font-sans selection:bg-lime-200 selection:text-lime-900">
      
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-lime-500/20">
            MB
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">MasBrew</h1>
            <div className="flex items-center gap-1.5 text-xs">
              <span className={cn(
                "w-2 h-2 rounded-full",
                status === 'connected' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : 
                status === 'connecting' ? "bg-amber-500 animate-pulse" : "bg-rose-500"
              )} />
              <span className="capitalize text-slate-500 font-medium">{status}</span>
            </div>
          </div>
        </div>
        
        {status !== 'connected' && status !== 'connecting' && (
           <button 
             onClick={reconnect}
             className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-lime-600 text-white rounded-lg transition-colors text-sm font-medium shadow-sm active:scale-95 transform duration-100"
           >
             <RefreshCw size={16} />
             <span className="hidden md:inline">Reconnect</span>
           </button>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 space-y-8 min-h-full">
          
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm mb-2">
                <Sparkles className="text-lime-500" size={32} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                How can I help today?
              </h2>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex gap-4 md:gap-5",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm mt-1",
                  msg.role === 'assistant' 
                    ? "bg-white border-slate-200" 
                    : "bg-slate-900 border-slate-900"
                )}>
                  {msg.role === 'assistant' ? (
                    <Bot size={18} className="text-lime-600" />
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={cn(
                  "flex-1 max-w-[85%] md:max-w-[90%]",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                   <div className={cn(
                     "relative inline-block text-left text-[15px] md:text-base leading-7",
                     "px-5 py-3.5 rounded-2xl shadow-sm border",
                     msg.role === 'user' 
                       ? "bg-slate-900 text-slate-50 border-slate-800 rounded-tr-sm" 
                       : "bg-white text-slate-800 border-slate-200 rounded-tl-sm"
                   )}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-slate prose-sm md:prose-base max-w-none prose-p:my-1 prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                   </div>
                   <div className={cn(
                     "mt-2 text-[11px] text-slate-400 font-medium px-1",
                     msg.role === 'user' ? "text-right" : "text-left"
                   )}>
                     {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex items-center gap-4"
            >
               <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot size={18} className="text-lime-600" />
               </div>
               <div className="flex gap-1.5 px-2">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
               </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl shadow-sm">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Connection lost. Attempting to reconnect...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <div className="max-w-5xl mx-auto relative group">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message MasBrew..."
            disabled={status !== 'connected'}
            className="w-full bg-white text-slate-800 border-slate-300 rounded-2xl pl-4 pr-14 py-4 min-h-[56px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200/50 transition-all placeholder:text-slate-400 text-base"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || status !== 'connected'}
            className={cn(
              "absolute right-2 bottom-2 p-2 rounded-xl transition-all duration-200 flex items-center justify-center",
              inputValue.trim() && status === 'connected'
                ? "bg-slate-900 text-white hover:bg-lime-600 shadow-md transform hover:scale-105"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            )}
          >
            <Send size={18} fill={inputValue.trim() ? "currentColor" : "none"} />
          </button>
        </div>
        <p className="text-center text-slate-400 text-xs mt-3 font-medium">
          MasBrew AI System • Development Preview
        </p>
      </div>
    </div>
  );
}
