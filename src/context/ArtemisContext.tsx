import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ArtemisState, ArtemisAction } from '../types';

const initialState: ArtemisState = {
  userNickname: 'Friend',
  assistantName: 'Artemis',
  assistantPersonality: 'Caring, supportive, best friend persona.',
  chatHistory: [],
  tasks: [],
  diaryEntries: [],
  healthLogs: [],
  isLocked: true,
  theme: 'cozy',
  onboarded: false,
  avatarConfig: {
    outfit: 'necklace',
    accessories: 'flowers',
    hairStyle: 'hair02',
    eyebrows: 'rose',
    eyes: 'happy',
    mouth: 'happy',
    mood: 'happy',
  },
  vitality: {
    happiness: 80,
    energy: 100,
  },
  roomState: {
    isLampOn: false,
    isMusicPlaying: false,
  },
};

const artemisReducer = (state: ArtemisState, action: ArtemisAction): ArtemisState => {
  switch (action.type) {
    case 'SET_NICKNAME':
      return { ...state, userNickname: action.payload };
    case 'SET_ASSISTANT_NAME':
      return { ...state, assistantName: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'CLEAR_CHAT':
      return { ...state, chatHistory: [] };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        ),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'ADD_DIARY_ENTRY':
      return { ...state, diaryEntries: [action.payload, ...state.diaryEntries] };
    case 'DELETE_DIARY_ENTRY':
      return { ...state, diaryEntries: state.diaryEntries.filter(e => e.id !== action.payload) };
    case 'SET_LOCKER_PASSWORD':
      return { ...state, lockerPassword: action.payload };
    case 'SET_LOCKED':
      return { ...state, isLocked: action.payload };
    case 'LOG_HEALTH':
      // This is a bit simplified, usually we find by date
      return { ...state, healthLogs: [...state.healthLogs, action.payload as any] };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_LAMP':
      return { ...state, roomState: { ...state.roomState, isLampOn: !state.roomState.isLampOn } };
    case 'TOGGLE_MUSIC':
      return { ...state, roomState: { ...state.roomState, isMusicPlaying: !state.roomState.isMusicPlaying } };
    case 'DECAY_STATS':
      const decayedEnergy = Math.max(0, state.vitality.energy - 0.5);
      const decayedHappiness = Math.max(0, state.vitality.happiness - 0.2);
      const moodAfterDecay = decayedHappiness > 75 ? 'happy' : decayedHappiness > 30 ? 'calm' : 'sad';
      const decayExpr = moodAfterDecay === 'happy' ? 'happy' : moodAfterDecay === 'calm' ? 'neutral' : 'sad';
      return { 
        ...state, 
        vitality: { energy: decayedEnergy, happiness: decayedHappiness },
        avatarConfig: { ...state.avatarConfig, mood: moodAfterDecay, eyes: decayExpr, mouth: decayExpr }
      };
    case 'RESET_APP':
      localStorage.removeItem('artemis_state');
      window.location.reload();
      return initialState;
    case 'COMPLETE_ONBOARDING':
      return { 
        ...state, 
        userNickname: action.payload.userName, 
        assistantName: action.payload.assistantName,
        onboarded: true 
      };
    case 'UPDATE_AVATAR':
      return { ...state, avatarConfig: { ...state.avatarConfig, ...action.payload } };
    case 'INTERACT':
      const newHappiness = Math.min(100, state.vitality.happiness + (action.payload === 'hug' ? 10 : 15));
      const newMood = newHappiness > 75 ? 'happy' : newHappiness > 30 ? 'calm' : 'sad';
      const interactExpr = newMood === 'happy' ? 'happy' : newMood === 'calm' ? 'neutral' : 'sad';
      return { 
        ...state, 
        vitality: { ...state.vitality, happiness: newHappiness },
        avatarConfig: { ...state.avatarConfig, mood: newMood, eyes: interactExpr, mouth: interactExpr }
      };
    case 'FEED':
      return { 
        ...state, 
        vitality: { ...state.vitality, energy: Math.min(100, state.vitality.energy + 20) },
        avatarConfig: { ...state.avatarConfig, mouth: 'happy' }
      };
    default:
      return state;
  }
};

const ArtemisContext = createContext<{
  state: ArtemisState;
  dispatch: React.Dispatch<ArtemisAction>;
} | null>(null);

export const ArtemisProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(artemisReducer, initialState, (initial) => {
    const saved = localStorage.getItem('artemis_state');
    if (!saved) return initial;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...initial,
        ...parsed,
        avatarConfig: { ...initial.avatarConfig, ...parsed.avatarConfig },
        vitality: { ...initial.vitality, ...parsed.vitality },
        roomState: { ...initial.roomState, ...parsed.roomState },
      };
    } catch (e) {
      console.error('Failed to parse saved state', e);
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem('artemis_state', JSON.stringify(state));
  }, [state]);

  // Stat Decay Timer
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'DECAY_STATS' });
    }, 60000); // Every 1 minute
    return () => clearInterval(timer);
  }, []);

  return (
    <ArtemisContext.Provider value={{ state, dispatch }}>
      {children}
    </ArtemisContext.Provider>
  );
};

export const useArtemisContext = () => {
  const context = useContext(ArtemisContext);
  if (!context) throw new Error('useArtemisContext must be used within ArtemisProvider');
  return context;
};
