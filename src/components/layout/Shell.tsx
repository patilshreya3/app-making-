import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  MessageSquare, 
  Calendar, 
  Heart, 
  Lock, 
  Settings,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useArtemisContext } from '../../context/ArtemisContext';
import { cn } from '../../lib/utils';

interface ShellProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Shell: React.FC<ShellProps> = ({ children, activeView, onViewChange }) => {
  const { state } = useArtemisContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'room', icon: Home, label: 'Virtual Room' },
    { id: 'chat', icon: MessageSquare, label: 'AI Friend' },
    { id: 'planner', icon: Calendar, label: 'Productivity' },
    { id: 'health', icon: Heart, label: 'Health' },
    { id: 'locker', icon: Lock, label: 'Locker' },
  ];

  const themeColors = {
    cozy: 'from-rose-100 to-indigo-200',
    midnight: 'from-slate-900 to-indigo-950',
    cyberpunk: 'from-black via-fuchsia-950 to-indigo-950',
    warm: 'from-orange-50 to-amber-100',
  };

  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col md:flex-row transition-colors duration-1000 bg-gradient-to-br",
      themeColors[state.theme]
    )}>
      {/* Background Atmosphere (Recipe 7 Inspired) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-rose-400/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-indigo-400/20 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border-b border-white/20 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-rose-500" />
          <span className="font-semibold text-rose-900 uppercase tracking-wider text-sm">{state.assistantName}</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Navigation - Sidebar (Desktop) / Overlay (Mobile) */}
      <nav className={cn(
        "z-40 transition-all duration-300 md:relative md:flex",
        isMenuOpen ? "fixed inset-0 bg-white/80 backdrop-blur-xl flex flex-col p-8" : "hidden md:w-20 lg:w-64 md:flex-col md:p-6 bg-white/20 backdrop-blur-md border-r border-white/20"
      )}>
        <div className="hidden lg:flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-indigo-600 uppercase tracking-tighter">
            {state.assistantName}
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setIsMenuOpen(false);
              }}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group",
                activeView === item.id 
                  ? "bg-rose-500 text-white shadow-lg scale-105" 
                  : "text-rose-900 hover:bg-white/40"
              )}
            >
              <item.icon className={cn("w-6 h-6", activeView === item.id ? "text-white" : "group-hover:scale-110")} />
              <span className={cn("font-medium md:hidden lg:block")}>{item.label}</span>
              {activeView === item.id && (
                <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-white rounded-r-full hidden lg:block" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 flex flex-col gap-2">
           <button 
             onClick={() => onViewChange('settings')}
             className="flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-900 hover:bg-white/40 transition-colors"
           >
             <Settings className="w-6 h-6" />
             <span className="font-medium md:hidden lg:block">Settings</span>
           </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
