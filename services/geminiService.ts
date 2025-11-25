import { GoogleGenAI } from "@google/genai";
import { Session, TimerMode } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getProductivityInsight = async (sessions: Session[]): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  // Filter for today's sessions
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysSessions = sessions.filter(s => s.timestamp >= today && s.mode === TimerMode.WORK && s.completed);
  const totalMinutes = Math.floor(todaysSessions.reduce((acc, curr) => acc + curr.duration, 0) / 60);
  const count = todaysSessions.length;

  const prompt = `
    I am using a Pomodoro timer. 
    Today, I have completed ${count} work sessions, totaling ${totalMinutes} minutes of focus.
    
    Based on this effort, give me a brief, encouraging productivity insight or tip. 
    If the count is low, motivate me to start. 
    If the count is high, remind me to rest or praise my consistency.
    Keep it under 50 words. Be friendly and concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Keep going, you're doing great!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Stay focused and take breaks! (AI unavailable)";
  }
};
