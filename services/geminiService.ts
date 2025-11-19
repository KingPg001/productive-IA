
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Estimates the point value of a task based on its difficulty and urgency.
 */
export const estimateTaskPoints = async (title: string, description: string, priority: string, tags: string[]): Promise<number> => {
  if (!process.env.API_KEY) return 10; // Fallback if no key

  try {
    const prompt = `
      Estimate a point value (integer between 5 and 100) for a task in a Study & Exercise tracker.
      
      Task Details:
      - Title: ${title}
      - Tags/Context: ${tags.join(', ')}
      - Priority: ${priority}

      Scoring Guide:
      - Study: 
        * Short revision/reading: 10-20 pts
        * Homework/Assignment: 30-50 pts
        * Major Project/Exam Prep: 60-100 pts
      - Exercise:
        * Light stretching/walking: 10-20 pts
        * Standard workout (30-45m): 30-50 pts
        * Intense training/Marathon prep: 60-100 pts
      
      Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            points: { type: Type.INTEGER }
          }
        }
      }
    });

    const json = JSON.parse(response.text || '{"points": 10}');
    return json.points;
  } catch (error) {
    console.error("Error estimating points:", error);
    return 25; // Default fallback
  }
};

/**
 * Generates a productivity insight/review based on user data.
 */
export const generateProductivityInsight = async (tasks: Task[], stats: any): Promise<string> => {
  if (!process.env.API_KEY) return "Add your API Key to get smart insights!";

  try {
    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    
    const prompt = `
      Act as a strict but encouraging academic and fitness coach. Analyze this user's performance:
      - Total XP: ${stats.totalPoints}
      - Streak: ${stats.currentStreak} days
      - Recent Wins: ${JSON.stringify(completedTasks.slice(0, 5).map(t => `${t.title} (${t.category})`))}
      - Pending Urgent: ${JSON.stringify(pendingTasks.filter(t => t.priority === 'High' || t.priority === 'Critical').map(t => t.title))}

      Focus on balancing Study and Exercise. 2-3 sentences max.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Keep studying hard and staying active!";
  } catch (error) {
    console.error("Error generating insight:", error);
    return "Balance your mind and body. Keep going!";
  }
};
