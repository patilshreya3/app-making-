import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useArtemisContext } from '../context/ArtemisContext';
import { AvatarImage } from '../components/avatar/AvatarImage';
import { Sparkles, Heart, Coffee, Sun, CloudRain, Moon, Lamp, Music, PauseCircle, PlayCircle, Star } from 'lucide-react';
import { cn } from '../lib/utils';

export const RoomView: React.FC = () => {
  const { state, dispatch } = useArtemisContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (state.roomState.isMusicPlaying) {
      if (!audioRef.current) {
        audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
      }
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser", e));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [state.roomState.isMusicPlaying]);

  const getDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-rose-600 font-bold tracking-widest uppercase text-xs mb-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Welcome back</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-rose-950 tracking-tight">
            {getDayGreeting()}, <span className="text-rose-600 italic font-medium">{state.userNickname}</span>
          </h1>
        </div>

        <div className="flex items-center gap-6 bg-white/40 backdrop-blur-md p-4 px-6 rounded-[32px] border border-white/40 shadow-sm">
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Happiness</span>
              <div className="w-24 h-2 bg-rose-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${state.vitality.happiness}%` }}
                  className="bg-rose-500 h-full"
                />
              </div>
           </div>
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Energy</span>
              <div className="w-24 h-2 bg-indigo-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${state.vitality.energy}%` }}
                  className="bg-indigo-500 h-full"
                />
              </div>
           </div>
           <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
             <Heart fill={state.avatarConfig.mood === 'happy' ? 'white' : 'transparent'} />
           </div>
        </div>
      </div>

      {/* The Central Stage: Avatar & Interactions */}
      <div className={cn(
        "relative aspect-video w-full max-h-[600px] rounded-[40px] border border-white/40 shadow-2xl overflow-hidden group transition-all duration-700",
        state.roomState.isLampOn ? "bg-amber-100/30" : "bg-indigo-950/40"
      )}>
        {/* Animated Mood Indicators / Atmosphere */}
        <AnimatePresence>
          {state.roomState.isLampOn && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-amber-400/10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white/30 to-transparent pointer-none" />
        
        {/* Interactive Objects Layer */}
        <div className="absolute inset-0 p-10 flex justify-between items-start z-20">
           {/* Lamp */}
           <motion.button 
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
             onClick={() => dispatch({ type: 'TOGGLE_LAMP' })}
             className={cn(
               "p-5 rounded-[28px] shadow-2xl transition-all border",
               state.roomState.isLampOn 
                 ? "bg-amber-400 text-white border-amber-300 ring-8 ring-amber-100" 
                 : "bg-white/10 text-indigo-200 border-white/10"
             )}
           >
              <Lamp className={cn("w-10 h-10", state.roomState.isLampOn && "animate-pulse")} />
              <div className="text-[10px] font-bold uppercase mt-2 tracking-widest text-center">Light</div>
           </motion.button>

           {/* Music Player */}
           <motion.button 
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
             onClick={() => dispatch({ type: 'TOGGLE_MUSIC' })}
             className={cn(
               "p-5 rounded-[28px] shadow-2xl transition-all border flex flex-col items-center",
               state.roomState.isMusicPlaying 
                 ? "bg-indigo-500 text-white border-indigo-400 ring-8 ring-indigo-100" 
                 : "bg-white/10 text-indigo-200 border-white/10"
             )}
           >
              {state.roomState.isMusicPlaying ? <PauseCircle className="w-10 h-10" /> : <PlayCircle className="w-10 h-10 shadow-lg" />}
              <div className="text-[10px] font-bold uppercase mt-2 tracking-widest text-center">Ambience</div>
              {state.roomState.isMusicPlaying && (
                 <div className="flex gap-0.5 mt-2">
                    {[1,2,3,4].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-0.5 bg-white rounded-full"
                      />
                    ))}
                 </div>
              )}
           </motion.button>
        </div>

        {/* Character Stage */}
        <div className="absolute inset-0 flex items-center justify-center">
           <motion.div 
             animate={{ 
               y: [0, -20, 0],
               scale: [1, 1.02, 1],
             }}
             transition={{ 
               duration: 6, 
               repeat: Infinity,
               ease: "easeInOut"
             }}
             className="relative pt-20"
           >
              {/* Magical Glow */}
              <div className={cn(
                "absolute inset-0 blur-[100px] rounded-full scale-150 animate-pulse transition-colors duration-1000",
                state.roomState.isLampOn ? "bg-amber-400/40" : "bg-rose-400/40"
              )} />
              
              {/* Detailed Character Illustration (Lorelei Style) */}
              <AvatarImage size="xl" showGlow />

              {/* Interaction Effects */}
              <AnimatePresence>
                {state.avatarConfig.mood === 'happy' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute -top-10 -right-10 bg-white p-4 rounded-3xl shadow-2xl"
                  >
                     <Sparkles className="w-8 h-8 text-rose-500 animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>
           </motion.div>
        </div>

        {/* Interaction Bar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/90 backdrop-blur-xl p-3 px-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/60 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 scale-95 group-hover:scale-100">
           <button 
             onClick={() => dispatch({ type: 'FEED' })}
             className="flex flex-col items-center gap-1 group/btn"
           >
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 group-hover/btn:bg-amber-500 group-hover/btn:text-white transition-all">
                <Coffee className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Feed</span>
           </button>

           <div className="w-[1px] h-8 bg-slate-200 mx-2" />

           <button 
             onClick={() => dispatch({ type: 'INTERACT', payload: 'hug' })}
             className="flex flex-col items-center gap-1 group/btn"
           >
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-500 group-hover/btn:bg-rose-500 group-hover/btn:text-white transition-all">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Hug</span>
           </button>

           <div className="w-[1px] h-8 bg-slate-200 mx-2" />

           <button 
             onClick={() => dispatch({ type: 'INTERACT', payload: 'play' })}
             className="flex flex-col items-center gap-1 group/btn"
           >
              <div className="p-3 rounded-2xl bg-yellow-50 text-yellow-500 group-hover/btn:bg-yellow-500 group-hover/btn:text-white transition-all">
                <Sun className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Play</span>
           </button>
        </div>
      </div>

      {/* Mini Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/40 shadow-sm hover:translate-y-[-4px] transition-transform">
            <div className="flex items-center justify-between mb-4">
               <div className="p-3 bg-rose-500 rounded-2xl text-white shadow-lg shadow-rose-100">
                  <Star className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-rose-700 uppercase tracking-widest leading-tight">Vibe Status</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-rose-100 overflow-hidden">
                 <AvatarImage size="sm" className="w-16 h-16 scale-150 mt-2" />
               </div>
               <div>
                  <div className="text-xl font-bold text-rose-950 capitalize">{state.avatarConfig.mood}</div>
                  <div className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">{state.assistantName}'s Mood</div>
               </div>
            </div>
         </div>

         <div className="bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/40 shadow-sm hover:translate-y-[-4px] transition-transform">
            <div className="flex items-center justify-between mb-4">
               <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-100">
                  <Moon className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Sleep Quality</span>
            </div>
            <div className="text-3xl font-bold text-indigo-950">8.2<span className="text-sm text-indigo-700/60 font-medium ml-1">/10</span></div>
            <div className="mt-2 w-full bg-indigo-200 h-1.5 rounded-full overflow-hidden">
               <div className="bg-indigo-600 h-full w-[82%]" />
            </div>
         </div>

         <div className="bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/40 shadow-sm hover:translate-y-[-4px] transition-transform">
            <div className="flex items-center justify-between mb-4">
               <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <CloudRain className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Hydration</span>
            </div>
            <div className="text-3xl font-bold text-blue-950">6<span className="text-sm text-blue-700/60 font-medium ml-1">glasses left</span></div>
            <div className="flex gap-2 mt-3">
               {[1,2,3,4,5,6,7,8].map(i => (
                 <div key={i} className={cn("w-3 h-6 rounded-sm", i <= 2 ? "bg-blue-500" : "bg-blue-100")} />
               ))}
            </div>
         </div>

         <div className="bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/40 shadow-sm hover:translate-y-[-4px] transition-transform flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                 <div className="p-3 bg-rose-500 rounded-2xl text-white shadow-lg shadow-rose-100">
                    <Sparkles className="w-6 h-6" />
                 </div>
                 <span className="text-xs font-bold text-rose-700 uppercase tracking-widest">Daily Wisdom</span>
              </div>
              <p className="text-sm text-rose-900/80 italic font-medium mt-2 leading-relaxed">
                "Small steps every day lead to big changes, {state.userNickname}."
              </p>
            </div>
            <button 
              onClick={() => {
                const views = ['chat', 'planner', 'health', 'locker', 'settings'];
                const randomView = views[Math.floor(Math.random() * views.length)];
                // Note: Normally we'd use a prop to change view, but for now we just show the message
                alert(`${state.assistantName} suggests you check out the "${randomView}" section today!`);
              }}
              className="mt-4 text-rose-600 font-bold text-xs uppercase tracking-widest hover:underline text-left"
            >
              Ask {state.assistantName} more →
            </button>
         </div>
      </div>
    </div>
  );
};
