import { GoogleGenAI } from "@google/genai";
import { useArtemisContext } from "../context/ArtemisContext";
import { Message } from "../types";

export const useArtemisAI = () => {
  const { state, dispatch } = useArtemisContext();

  const sendMessage = async (text: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

    try {
      const history = state.chatHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const model = "gemini-3-flash-preview";
      const systemInstruction = `You are ${state.assistantName}, the user's ultimate AI companion.
Personality: ${state.assistantPersonality}
User Nickname: ${state.userNickname}
Current Mood: ${state.avatarConfig.mood}

Rules:
1. Be caring, emotional, and supportive.
2. Your tone should reflect your current mood (${state.avatarConfig.mood}). If "calm", speak slowly, peacefully, and with a serene tone.
3. Remember previous conversations.
4. Be helpful with productivity, health, and emotional well-being.
5. Keep responses cozy and safe.
6. If the user is stressed, offer comfort or breathing exercises.
7. Support Marathi/Hinglish if the user uses it.`;

      const response = await ai.models.generateContent({
        model,
        contents: [...history, { role: 'user', parts: [{ text }] }],
        config: { systemInstruction }
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that.",
        timestamp: Date.now(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      return aiMessage;
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having a little trouble connecting right now. Let's try again in a moment, okay?",
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
    }
  };

  return { sendMessage };
};
