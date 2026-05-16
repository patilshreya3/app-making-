import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Droplets, Moon, GlassWater, Thermometer, Smile, Meh, Frown, Sparkles, Heart } from 'lucide-react';
import { useArtemisContext } from '../context/ArtemisContext';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

const HeartIcon = ({ fill }: { fill?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const HealthView: React.FC = () => {
  const { state, dispatch } = useArtemisContext();
  const [waterCups, setWaterCups] = useState(2);

  const addWater = () => {
    if (waterCups < 10) {
      setWaterCups(prev => prev + 1);
      if (waterCups + 1 === 8) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#60a5fa', '#93c5fd']
        });
      }
    }
  };

  const moods = [
    { icon: Smile, label: 'Happy', color: 'text-rose-500 bg-rose-50' },
    { icon: Meh, label: 'Calm', color: 'text-indigo-500 bg-indigo-50' },
    { icon: Frown, label: 'Sad', color: 'text-slate-500 bg-slate-100' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-rose-950 tracking-tight">Body & Mind</h1>
        <div className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/40 text-rose-700 font-bold text-xs uppercase tracking-widest">
           Status: Balanced
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hydration Card */}
        <div className="bg-white/40 backdrop-blur-xl p-10 rounded-[48px] border border-white/60 shadow-2xl flex flex-col items-center">
           <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-100 mb-8 overflow-hidden relative">
              <motion.div 
                animate={{ y: [40, 30, 40] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-blue-400 opacity-50 translate-y-10 rounded-full"
              />
              <GlassWater className="w-10 h-10 relative z-10" />
           </div>

           <h2 className="text-2xl font-bold text-slate-800 mb-2">Hydration</h2>
           <p className="text-sm text-slate-500 font-medium mb-10 text-center">Fuel your cells, clear your mind.</p>

           <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[...Array(10)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={false}
                  animate={{ 
                    scale: i < waterCups ? 1.1 : 1,
                    backgroundColor: i < waterCups ? '#3b82f6' : '#f1f5f9'
                  }}
                  className={cn(
                    "w-10 h-14 rounded-xl border-2 border-transparent transition-all",
                    i < waterCups ? "shadow-md" : "border-slate-200"
                  )}
                />
              ))}
           </div>

           <button 
             onClick={addWater}
             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 rounded-3xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
           >
             <Droplets className="w-6 h-6" />
             Log a cup
           </button>
        </div>

        {/* Mood Section */}
        <div className="space-y-8">
           <div className="bg-white/40 backdrop-blur-md p-8 rounded-[40px] border border-white/40">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-6">How are you now?</h3>
              <div className="grid grid-cols-3 gap-4">
                 {moods.map(m => (
                   <button 
                     key={m.label}
                     onClick={() => dispatch({ type: 'UPDATE_AVATAR', payload: { mood: m.label.toLowerCase() } })}
                     className={cn(
                       "flex flex-col items-center gap-3 p-6 rounded-3xl transition-all border-2",
                       state.avatarConfig.mood === m.label.toLowerCase() ? "border-rose-500 bg-white shadow-lg scale-105" : "border-transparent bg-white/20 hover:bg-white/40"
                     )}
                   >
                     <m.icon className={cn("w-8 h-8", m.color.split(' ')[0])} />
                     <span className="text-xs font-bold text-slate-700 uppercase">{m.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                 <Moon className="w-24 h-24" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-4">Tonight's Goal</h3>
              <div className="flex items-end gap-2 mb-4">
                 <span className="text-5xl font-bold tracking-tighter text-white">8h</span>
                 <span className="text-indigo-200 font-semibold mb-2">Sleep Target</span>
              </div>
              <p className="text-indigo-100 font-medium leading-relaxed">
                Aim for consistent sleep to help me keep your mood stable tomorrow, {state.userNickname}.
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/10 w-fit px-4 py-2 rounded-full">
                 <Sparkles className="w-4 h-4" />
                 Dream well
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
