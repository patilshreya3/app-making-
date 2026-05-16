import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Smile, Image as ImageIcon, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useArtemisContext } from '../context/ArtemisContext';
import { useArtemisAI } from '../hooks/useArtemisAI';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

import { AvatarImage } from '../components/avatar/AvatarImage';

export const ChatView: React.FC = () => {
  const { state } = useArtemisContext();
  const { sendMessage } = useArtemisAI();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    await sendMessage(currentInput);
    setIsTyping(false);
  };

  return (
    <div className="h-[80vh] flex flex-col bg-white/40 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/20 flex items-center justify-between bg-white/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-400 to-indigo-500 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <AvatarImage size="sm" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-rose-900 leading-tight">{state.assistantName}</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-rose-700/70 font-medium uppercase tracking-widest">Always here for you</span>
            </div>
          </div>
        </div>
        <Sparkles className="text-rose-500 w-6 h-6" />
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth"
      >
        {state.chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
            <Sparkles className="w-12 h-12 text-rose-300 mb-4" />
            <h3 className="text-xl font-semibold text-rose-900">Sweet beginnings...</h3>
            <p className="text-rose-800 max-w-xs mt-2">I'm so happy you're here. How are you feeling today, {state.userNickname}?</p>
          </div>
        )}
        
        {state.chatHistory.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className={cn(
              "flex w-full mb-4",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] md:max-w-[70%] p-5 rounded-3xl shadow-sm relative",
              msg.role === 'user' 
                ? "bg-rose-500 text-white rounded-br-none" 
                : "bg-white text-slate-800 rounded-bl-none border border-rose-100"
            )}>
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-pink-100">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              <span className={cn(
                "text-[10px] mt-2 block opacity-50 font-medium",
                msg.role === 'user' ? "text-right" : "text-left"
              )}>
                {format(msg.timestamp, 'HH:mm')}
              </span>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-white p-4 rounded-3xl rounded-bl-none border border-rose-100 flex gap-1 items-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white/30 backdrop-blur-md border-t border-white/20">
        <div className="flex items-center gap-3 bg-white/80 p-2 pl-4 rounded-[30px] border border-rose-100 shadow-inner group focus-within:ring-2 ring-rose-400/50 transition-all">
          <button className="text-rose-400 hover:text-rose-600 transition-colors p-1">
            <Smile className="w-6 h-6" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Whisper to ${state.assistantName}...`}
            className="flex-1 bg-transparent border-none focus:ring-0 text-rose-950 placeholder:text-rose-300 font-medium"
          />
          <div className="flex gap-1 pr-1">
             <button className="text-rose-300 hover:text-rose-500 transition-colors p-2 hidden sm:block">
              <Mic className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 text-white p-3 rounded-full shadow-lg hover:shadow-rose-500/30 transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
