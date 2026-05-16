import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { useArtemisContext } from '../context/ArtemisContext';
import { cn } from '../lib/utils';

export const PlannerView: React.FC = () => {
  const { state, dispatch } = useArtemisContext();
  const [newTask, setNewTask] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const addTask = () => {
    if (!newTask.trim()) return;
    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        priority: 'medium',
      },
    });
    setNewTask('');
  };

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      alert('Focus session complete!');
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Todo List */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-8 border border-white/40 shadow-2xl flex flex-col h-[70vh]">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-rose-950">Daily Quest</h2>
           <span className="text-xs font-bold text-rose-500 bg-rose-100 px-3 py-1 rounded-full">
             {state.tasks.filter(t => t.completed).length}/{state.tasks.length} Done
           </span>
        </div>

        <div className="flex gap-3 mb-8">
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 bg-white/60 border border-rose-100 rounded-2xl px-5 py-3 text-rose-950 placeholder:text-rose-300 focus:ring-2 ring-rose-400 outline-none transition-all"
          />
          <button 
            onClick={addTask}
            className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-2xl shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          <AnimatePresence initial={false}>
            {state.tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-3xl transition-all",
                  task.completed ? "bg-rose-100/30 opacity-60" : "bg-white/80 shadow-sm hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-4">
                  <button onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}>
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-rose-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-rose-300" />
                    )}
                  </button>
                  <span className={cn(
                    "font-medium text-rose-950",
                    task.completed && "line-through"
                  )}>
                    {task.title}
                  </span>
                </div>
                <button 
                  onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                  className="opacity-0 group-hover:opacity-100 p-2 text-rose-300 hover:text-rose-600 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {state.tasks.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-40 py-10">
               <Clock className="w-12 h-12 mb-3" />
               <p className="font-medium">No tasks yet. Let's plan something!</p>
            </div>
          )}
        </div>
      </div>

      {/* Focus Timer */}
      <div className="flex flex-col gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
              <Clock className="w-32 h-32" />
           </div>
           
           <div className="relative z-10">
              <h2 className="text-xl font-bold uppercase tracking-widest opacity-80 mb-10">Focus Session</h2>
              
              <div className="flex flex-col items-center justify-center py-6">
                 <div className="text-8xl font-bold tracking-tighter mb-4 tabular-nums">
                   {formatTime(timeLeft)}
                 </div>
                 <div className="text-indigo-200 font-medium uppercase tracking-widest text-sm mb-12">
                   {timeLeft > 299 ? 'Concentrate' : 'Keep it up!'}
                 </div>

                 <div className="flex items-center gap-6">
                    <button 
                      onClick={resetTimer}
                      className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <RotateCcw className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={toggleTimer}
                      className="w-20 h-20 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      {timerActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-1" />}
                    </button>
                    <div className="w-14" /> {/* Spacer */}
                 </div>
              </div>
           </div>
        </div>

        {/* Productivity Quote Card */}
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-[40px] border border-white/40 shadow-sm">
           <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">Pro Tip</h3>
           <p className="text-rose-950 font-medium leading-relaxed italic">
             "Don't busy yourself with what you will do. Busy yourself with what you are doing now."
           </p>
           <div className="mt-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white">
                 <Plus className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-rose-700">Stay consistent, {state.userNickname}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
