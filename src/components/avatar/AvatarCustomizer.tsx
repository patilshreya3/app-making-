import React from 'react';
import { useArtemisContext } from '../../context/ArtemisContext';
import { AvatarImage } from './AvatarImage';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export const AvatarCustomizer: React.FC = () => {
  const { state, dispatch } = useArtemisContext();

  const outfits = [
    { id: 'leotard', label: 'Leotard' },
    { id: 'necklace', label: 'Traditional' },
    { id: 'overall', label: 'Overalls' },
    { id: 'shirt', label: 'Casual Shirt' },
    { id: 'sweater', label: 'Cozy Sweater' },
  ];

  const hairs = [
    { id: 'long01', label: 'Straight Long' },
    { id: 'long02', label: 'Wavy Long' },
    { id: 'hair01', label: 'Short Buns' },
    { id: 'hair02', label: 'Elegant Updo' },
    { id: 'hair03', label: 'Sweet Pigtails' },
  ];

  const accessories = [
    { id: 'none', label: 'None' },
    { id: 'flowers', label: 'Floral Crown' },
    { id: 'glasses', label: 'Chic Glasses' },
    { id: 'sunglasses', label: 'Cool Shades' },
    { id: 'eyepatch', label: 'Mysterious' },
  ];

  const moods = [
    { id: 'happy', label: 'Happy', eyes: 'happy', mouth: 'happy' },
    { id: 'calm', label: 'Calm', eyes: 'neutral', mouth: 'neutral' },
    { id: 'sad', label: 'Sad', eyes: 'sad', mouth: 'sad' },
  ];

  const facialOptions = [
    { id: 'happy', label: 'Happy' },
    { id: 'neutral', label: 'Neutral' },
    { id: 'surprised', label: 'Surprised' },
    { id: 'wink', label: 'Wink' },
    { id: 'sad', label: 'Sad' },
  ];

  const updateConfig = (key: string, value: string) => {
    dispatch({
      type: 'UPDATE_AVATAR',
      payload: { [key]: value } as any
    });
  };

  const setMood = (m: typeof moods[0]) => {
    dispatch({
      type: 'UPDATE_AVATAR',
      payload: { 
        mood: m.id,
        eyes: m.eyes,
        mouth: m.mouth
      }
    });
  };

  const avatarUrl = `https://api.dicebear.com/7.x/lorelei/svg?seed=${state.assistantName}&clothing=${state.avatarConfig.outfit}&hair=${state.avatarConfig.hairStyle}&accessories=${state.avatarConfig.accessories !== 'none' ? state.avatarConfig.accessories : ''}&eyes=${state.avatarConfig.eyes}&mouth=${state.avatarConfig.mouth}&eyebrows=${state.avatarConfig.eyebrows}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Preview */}
        <div className="md:w-1/3 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[40px] p-8 border border-white/40 shadow-xl self-start sticky top-8">
           <AvatarImage size="lg" className="mb-6" />
           <h3 className="text-xl font-bold text-rose-950 capitalize">{state.assistantName}</h3>
           <p className="text-sm font-medium text-rose-700/60 uppercase tracking-widest">Style Preview</p>
        </div>

        {/* Tools */}
        <div className="flex-1 space-y-12">
           {/* Mood Section */}
           <section>
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 ml-2">Emotional Mood</h4>
              <div className="grid grid-cols-3 gap-4">
                 {moods.map(m => (
                   <button 
                     key={m.id}
                     onClick={() => setMood(m)}
                     className={cn(
                       "flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all",
                       state.avatarConfig.mood === m.id 
                         ? "bg-white border-rose-500 shadow-xl scale-105 ring-4 ring-rose-100" 
                         : "bg-white/10 border-transparent hover:bg-white/40"
                     )}
                   >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xl",
                        state.avatarConfig.mood === m.id ? "bg-rose-500 text-white" : "bg-white/50 text-rose-900"
                      )}>
                        {m.id === 'happy' ? '😊' : m.id === 'calm' ? '😌' : '😔'}
                      </div>
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        state.avatarConfig.mood === m.id ? "text-rose-950" : "text-rose-950/60"
                      )}>{m.label}</span>
                   </button>
                 ))}
              </div>
           </section>

           {/* Facial Expression Section */}
           <section>
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 ml-2">Expression</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 {facialOptions.map(f => (
                   <button 
                     key={f.id}
                     onClick={() => {
                        updateConfig('eyes', f.id);
                        updateConfig('mouth', f.id);
                     }}
                     className={cn(
                       "p-4 rounded-2xl border-2 transition-all flex items-center justify-between",
                       state.avatarConfig.eyes === f.id ? "bg-white border-rose-500 shadow-md" : "bg-white/20 border-transparent hover:bg-white/60"
                     )}
                   >
                     <span className="text-sm font-bold text-rose-950">{f.label}</span>
                   </button>
                 ))}
              </div>
           </section>
           {/* Outfits */}
           <section>
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 ml-2">Outfits</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 {outfits.map(o => (
                   <button 
                     key={o.id}
                     onClick={() => updateConfig('outfit', o.id)}
                     className={cn(
                       "p-4 rounded-2xl border-2 transition-all flex items-center justify-between",
                       state.avatarConfig.outfit === o.id ? "bg-white border-rose-500 shadow-md" : "bg-white/20 border-transparent hover:bg-white/60"
                     )}
                   >
                     <span className="text-sm font-bold text-rose-950">{o.label}</span>
                     {state.avatarConfig.outfit === o.id && <Check className="w-4 h-4 text-rose-500" />}
                   </button>
                 ))}
              </div>
           </section>

           {/* Hair Styles */}
           <section>
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 ml-2">Hair Styles</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 {hairs.map(h => (
                   <button 
                     key={h.id}
                     onClick={() => updateConfig('hairStyle', h.id)}
                     className={cn(
                       "p-4 rounded-2xl border-2 transition-all flex items-center justify-between",
                       state.avatarConfig.hairStyle === h.id ? "bg-white border-rose-500 shadow-md" : "bg-white/20 border-transparent hover:bg-white/60"
                     )}
                   >
                     <span className="text-sm font-bold text-rose-950">{h.label}</span>
                     {state.avatarConfig.hairStyle === h.id && <Check className="w-4 h-4 text-rose-500" />}
                   </button>
                 ))}
              </div>
           </section>

           {/* Accessories */}
           <section>
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 ml-2">Accessories / Gestures</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 {accessories.map(a => (
                   <button 
                     key={a.id}
                     onClick={() => updateConfig('accessories', a.id)}
                     className={cn(
                       "p-4 rounded-2xl border-2 transition-all flex items-center justify-between",
                       state.avatarConfig.accessories === a.id ? "bg-white border-rose-500 shadow-md" : "bg-white/20 border-transparent hover:bg-white/60"
                     )}
                   >
                     <span className="text-sm font-bold text-rose-950">{a.label}</span>
                     {state.avatarConfig.accessories === a.id && <Check className="w-4 h-4 text-rose-500" />}
                   </button>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};
