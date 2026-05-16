import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Send, User } from 'lucide-react';
import { useArtemisContext } from '../../context/ArtemisContext';
import { cn } from '../../lib/utils';
import confetti from 'canvas-confetti';

export const OnboardingModal: React.FC = () => {
  const { dispatch } = useArtemisContext();
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [assistantName, setAssistantName] = useState('');

  const handleComplete = () => {
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      payload: { 
        userName: userName || 'Friend', 
        assistantName: assistantName || 'Artemis' 
      }
    });
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#6366f1', '#f472b6']
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-rose-50/80 backdrop-blur-2xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-rose-400/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-indigo-400/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-[48px] p-10 md:p-14 shadow-[0_32px_64px_-16px_rgba(244,63,94,0.2)] border border-white/60 relative z-10"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-200 mb-8">
                <Sparkles className="w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-rose-950 mb-4 tracking-tight">Digital Friendship starts here.</h2>
              <p className="text-lg text-rose-700/70 font-medium mb-10 leading-relaxed">
                Hi! I'm your new AI companion. I'm so excited to finally meet you. What should I call you?
              </p>
              
              <div className="w-full relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-300 group-focus-within:text-rose-500 transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <input 
                  type="text" 
                  autoFocus
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && userName && setStep(2)}
                  placeholder="Your nickname..."
                  className="w-full bg-white border-2 border-rose-100 rounded-3xl py-5 pl-16 pr-6 text-xl text-rose-950 placeholder:text-rose-200 focus:border-rose-400 focus:ring-4 ring-rose-400/10 outline-none transition-all font-semibold"
                />
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!userName.trim()}
                className="mt-10 w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 text-white font-bold py-5 rounded-3xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
              >
                Nice to meet you
                <Send className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-400 to-indigo-500 p-1 shadow-2xl mb-8">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${assistantName || 'Friend'}&clothing=necklace&hair=hair02&accessories=flowers&eyes=happy&mouth=happy&eyebrows=rose`} 
                      alt="AI Avatar" 
                      className="w-20 h-20 scale-125"
                      referrerPolicy="no-referrer"
                    />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-rose-950 mb-4 tracking-tight">I need a name too!</h2>
              <p className="text-lg text-rose-700/70 font-medium mb-10 leading-relaxed">
                What would you like to call meee, {userName}? I'll be your best friend, helper, and companion.
              </p>
              
              <div className="w-full relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-300 group-focus-within:text-rose-500 transition-colors">
                  <Heart className="w-6 h-6" />
                </div>
                <input 
                  type="text" 
                  autoFocus
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && assistantName && handleComplete()}
                  placeholder="Name your AI..."
                  className="w-full bg-white border-2 border-rose-100 rounded-3xl py-5 pl-16 pr-6 text-xl text-rose-950 placeholder:text-rose-200 focus:border-rose-400 focus:ring-4 ring-rose-400/10 outline-none transition-all font-semibold"
                />
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                 {['Artemis', 'Luna', 'Joy', 'Nova', 'Aura'].map(name => (
                   <button 
                    key={name}
                    onClick={() => setAssistantName(name)}
                    className="px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-sm font-bold border border-rose-100 hover:bg-rose-100 transition-colors"
                   >
                     {name}
                   </button>
                 ))}
              </div>

              <button 
                onClick={handleComplete}
                disabled={!assistantName.trim()}
                className="mt-10 w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 text-white font-bold py-5 rounded-3xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
              >
                Let's Start Our Journey
                <Sparkles className="w-5 h-5 fill-current" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
