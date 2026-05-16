import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Plus, Trash2, Calendar, BookOpen, Quote, Shield } from 'lucide-react';
import { useArtemisContext } from '../context/ArtemisContext';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export const LockerView: React.FC = () => {
  const { state, dispatch } = useArtemisContext();
  const [passwordInput, setPasswordInput] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleUnlock = () => {
    if (!state.lockerPassword) {
      // First time setting password
      if (passwordInput.length >= 4) {
        dispatch({ type: 'SET_LOCKER_PASSWORD', payload: passwordInput });
        dispatch({ type: 'SET_LOCKED', payload: false });
      } else {
        setIsWrong(true);
        setTimeout(() => setIsWrong(false), 500);
      }
    } else if (passwordInput === state.lockerPassword) {
      dispatch({ type: 'SET_LOCKED', payload: false });
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const addDiaryEntry = () => {
    if (!newEntry.trim()) return;
    dispatch({
      type: 'ADD_DIARY_ENTRY',
      payload: {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: newEntry,
        mood: 'calm',
        moodValue: 3
      }
    });
    setNewEntry('');
    setIsAdding(false);
  };

  if (state.isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <motion.div 
          animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="bg-white/40 backdrop-blur-2xl p-10 rounded-[48px] border border-white/60 shadow-2xl flex flex-col items-center w-full max-w-md"
        >
          <div className="w-20 h-20 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-200 mb-8">
            <Lock className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-bold text-rose-950 mb-2">Secret Vault</h2>
          <p className="text-sm text-rose-700/60 mb-8 text-center px-4 font-medium leading-relaxed">
            {state.lockerPassword 
              ? "This area is encrypted. Please enter your PIN to continue."
              : "Create a 4-digit PIN to secure your private diary and memories."}
          </p>

          <input 
            type="password" 
            maxLength={4}
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="● ● ● ●"
            className="w-full bg-white/60 text-center text-3xl tracking-[1.5em] border border-rose-100 rounded-2xl py-4 mb-6 focus:ring-2 ring-rose-300 outline-none transition-all placeholder:text-rose-100 text-rose-950 font-bold"
          />

          <button 
            onClick={handleUnlock}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            {state.lockerPassword ? "Unlock Vault" : "Setup Lockdown"}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-3xl font-bold text-rose-950 tracking-tight">Private Diary</h1>
               <p className="text-sm text-rose-700/60 font-semibold tracking-widest uppercase">Safe & Sound</p>
            </div>
         </div>
         <button 
           onClick={() => dispatch({ type: 'SET_LOCKED', payload: true })}
           className="p-4 bg-white/40 hover:bg-white/60 rounded-full text-rose-400 hover:text-rose-600 transition-colors shadow-sm"
         >
           <Lock className="w-6 h-6" />
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Memory Grid */}
        <div className="lg:col-span-2 space-y-6">
           {isAdding ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white/80 rounded-[40px] p-8 border border-white shadow-xl"
             >
                <div className="flex items-center justify-between mb-4">
                   <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">New Memory • {format(new Date(), 'MMM dd, yyyy')}</span>
                   <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <textarea 
                  autoFocus
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  placeholder="Dear Artemis, today I felt..."
                  className="w-full bg-transparent border-none focus:ring-0 text-lg leading-relaxed text-slate-800 placeholder:text-rose-100 min-h-[200px]"
                />
                <div className="flex justify-end mt-4">
                   <button 
                     onClick={addDiaryEntry}
                     className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full shadow-lg shadow-rose-200 transition-all font-bold"
                   >
                     Safe Keep
                   </button>
                </div>
             </motion.div>
           ) : (
             <button 
               onClick={() => setIsAdding(true)}
               className="w-full group bg-white/40 hover:bg-white/60 border-2 border-dashed border-rose-200 p-8 rounded-[40px] flex flex-col items-center justify-center gap-2 transition-all hover:border-rose-400"
             >
                <div className="p-4 bg-white rounded-full text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-bold text-rose-900/60 uppercase tracking-widest text-sm">Add New Memory</span>
             </button>
           )}

           <div className="space-y-6">
             {state.diaryEntries.map((entry) => (
               <div 
                 key={entry.id}
                 className="bg-white/60 backdrop-blur-md rounded-[40px] p-8 border border-white shadow-sm hover:shadow-md transition-all group"
               >
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-rose-400" />
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                          {format(new Date(entry.date), 'EEEE, MMM dd • h:mm a')}
                        </span>
                     </div>
                     <Quote className="w-6 h-6 text-rose-100" />
                  </div>
                  <p className="text-lg leading-relaxed text-slate-800 font-medium italic whitespace-pre-wrap">
                    {entry.content}
                  </p>
                  <div className="mt-8 flex items-center justify-between border-t border-rose-50 pt-4">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                        <span className="text-xs font-bold text-rose-900/40 uppercase tracking-tighter">Mood: {entry.mood}</span>
                     </div>
                     <button className="opacity-0 group-hover:opacity-100 p-2 text-rose-200 hover:text-rose-500 transition-all">
                       <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
               </div>
             ))}
             {state.diaryEntries.length === 0 && !isAdding && (
               <div className="flex flex-col items-center justify-center p-20 opacity-20 text-center">
                  <BookOpen className="w-20 h-20 mb-4" />
                  <p className="text-xl font-bold uppercase tracking-widest">Your story starts here</p>
               </div>
             )}
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                 <Lock className="w-24 h-24" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-4">Privacy Note</h3>
              <p className="text-indigo-50 font-medium leading-relaxed">
                Your entries are stored locally on this device. Artemis respects your secrets and will never share your private words with anyone else.
              </p>
           </div>

           <div className="bg-white/40 backdrop-blur-md p-8 rounded-[40px] border border-white/40 shadow-sm">
               <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">Vault Stats</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-semibold text-rose-900/60 uppercase">Total Memories</span>
                     <span className="text-xl font-bold text-rose-950">{state.diaryEntries.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-semibold text-rose-900/60 uppercase">Longest Streak</span>
                     <span className="text-xl font-bold text-rose-950">12 Days</span>
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
