import React from 'react';
import { useArtemisContext } from '../context/ArtemisContext';
import { User, Sparkles, Palette, Trash2, Shield, Info } from 'lucide-react';
import { cn } from '../lib/utils';

import { AvatarCustomizer } from '../components/avatar/AvatarCustomizer';

export const SettingsView: React.FC = () => {
  const { state, dispatch } = useArtemisContext();

  const themes: { id: typeof state.theme; color: string; label: string }[] = [
    { id: 'cozy', color: 'bg-rose-400', label: 'Cozy Pink' },
    { id: 'midnight', color: 'bg-indigo-900', label: 'Midnight Blue' },
    { id: 'cyberpunk', color: 'bg-fuchsia-950', label: 'Neon Cyber' },
    { id: 'warm', color: 'bg-amber-100', label: 'Warm Sun' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-32">
      <div>
        <h1 className="text-4xl font-bold text-rose-950 tracking-tight">Settings</h1>
        <p className="text-rose-700/60 font-medium text-lg">Customize your companion experience</p>
      </div>

      {/* Identity Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold text-rose-900 uppercase tracking-widest text-xs">Identity</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40 backdrop-blur-md p-8 rounded-[40px] border border-white/40 shadow-sm">
           <div className="space-y-3">
              <label className="text-xs font-bold text-rose-400 uppercase ml-2 tracking-widest">What should I call you?</label>
              <input 
                type="text" 
                value={state.userNickname}
                onChange={(e) => dispatch({ type: 'SET_NICKNAME', payload: e.target.value })}
                className="w-full bg-white/60 border border-rose-100 p-5 rounded-3xl focus:ring-4 ring-rose-400/10 outline-none font-semibold text-rose-950 transition-all focus:bg-white"
              />
           </div>
           <div className="space-y-3">
              <label className="text-xs font-bold text-rose-400 uppercase ml-2 tracking-widest">My Name</label>
              <input 
                type="text" 
                value={state.assistantName}
                onChange={(e) => dispatch({ type: 'SET_ASSISTANT_NAME', payload: e.target.value })}
                className="w-full bg-white/60 border border-rose-100 p-5 rounded-3xl focus:ring-4 ring-rose-400/10 outline-none font-semibold text-rose-950 transition-all focus:bg-white"
              />
           </div>
        </div>
      </section>

      {/* Avatar Styling Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold text-rose-900 uppercase tracking-widest text-xs">Assistant Styling</h2>
        </div>
        <AvatarCustomizer />
      </section>

      {/* Theme Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold text-rose-900 uppercase tracking-widest text-sm">Ambience</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {themes.map((t) => (
             <button
               key={t.id}
               onClick={() => dispatch({ type: 'SET_THEME', payload: t.id })}
               className={cn(
                 "p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all",
                 state.theme === t.id ? "bg-white border-rose-500 shadow-lg scale-105" : "bg-white/40 border-transparent grayscale hover:grayscale-0"
               )}
             >
                <div className={cn("w-12 h-12 rounded-2xl shadow-inner", t.color)} />
                <span className="text-xs font-bold text-rose-950 uppercase tracking-tighter">{t.label}</span>
             </button>
           ))}
        </div>
      </section>

      {/* Privacy Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold text-rose-900 uppercase tracking-widest text-sm">Security</h2>
        </div>
        
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/40 flex items-center justify-between">
           <div>
              <h3 className="font-bold text-rose-950">Reset Vault PIN</h3>
              <p className="text-sm text-rose-700/60 font-medium">Clear your current 4-digit lock code</p>
           </div>
           <button 
             onClick={() => dispatch({ type: 'SET_LOCKER_PASSWORD', payload: '' })}
             className="px-6 py-3 bg-rose-100 text-rose-600 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-rose-200"
           >
             Clear PIN
           </button>
        </div>

         <div className="bg-rose-600/10 p-6 rounded-[32px] border border-rose-200 flex items-center justify-between">
           <div>
              <h3 className="font-bold text-rose-900">Purge Memory</h3>
              <p className="text-sm text-rose-800/60 font-medium whitespace-pre-wrap">Wipe all chat history and local data</p>
           </div>
           <button 
             onClick={() => {
               if(confirm("Are you sure you want to purge all memory and reset the app? This cannot be undone.")) {
                 dispatch({ type: 'RESET_APP' });
               }
             }}
             className="p-4 bg-rose-500 text-white rounded-2xl shadow-lg hover:bg-rose-600 active:scale-95 transition-all"
           >
             <Trash2 className="w-6 h-6" />
           </button>
        </div>
      </section>

      {/* About Section */}
      <div className="pt-20 border-t border-rose-100 flex flex-col items-center text-center opacity-40">
         <Sparkles className="w-8 h-8 text-rose-300 mb-4" />
         <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-900">Artemis v1.0.0 (Prototype)</p>
         <p className="text-xs font-medium text-rose-700 mt-2">Built with love for your emotional well-being.</p>
      </div>
    </div>
  );
};
