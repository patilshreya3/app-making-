/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  moodValue: number; // 1-5
}

export interface HealthLog {
  id: string;
  date: string;
  waterIntake: number; // glasses
  sleepHours: number;
  steps: number;
}

export interface ArtemisState {
  userNickname: string;
  assistantName: string;
  assistantPersonality: string;
  chatHistory: Message[];
  tasks: Task[];
  diaryEntries: DiaryEntry[];
  healthLogs: HealthLog[];
  lockerPassword?: string;
  isLocked: boolean;
  theme: 'cozy' | 'midnight' | 'cyberpunk' | 'warm';
  onboarded: boolean;
  avatarConfig: {
    outfit: string;
    accessories: string;
    hairStyle: string;
    eyebrows: string;
    eyes: string;
    mouth: string;
    mood: string;
  };
  vitality: {
    happiness: number;
    energy: number;
  };
  roomState: {
    isLampOn: boolean;
    isMusicPlaying: boolean;
  };
}

export type ArtemisAction =
  | { type: 'SET_NICKNAME'; payload: string }
  | { type: 'SET_ASSISTANT_NAME'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'CLEAR_CHAT' }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_DIARY_ENTRY'; payload: DiaryEntry }
  | { type: 'DELETE_DIARY_ENTRY'; payload: string }
  | { type: 'SET_LOCKER_PASSWORD'; payload: string }
  | { type: 'SET_LOCKED'; payload: boolean }
  | { type: 'LOG_HEALTH'; payload: Partial<HealthLog> }
  | { type: 'SET_THEME'; payload: ArtemisState['theme'] }
  | { type: 'COMPLETE_ONBOARDING'; payload: { userName: string; assistantName: string } }
  | { type: 'TOGGLE_LAMP' }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'DECAY_STATS' }
  | { type: 'RESET_APP' }
  | { type: 'INTERACT'; payload: 'hug' | 'play' }
  | { type: 'FEED' }
  | { type: 'UPDATE_AVATAR'; payload: Partial<ArtemisState['avatarConfig']> };
