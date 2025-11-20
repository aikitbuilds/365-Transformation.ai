
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Goal } from "../types";

export const getCoachingInsight = async (recentEntries: string): Promise<any> => {
    // In a real app, you would pass recent journal entries to the AI.
    // For now, we return a mock insight.
    console.log("Fetching coaching insight for:", recentEntries);
    
    // Simulate API call delay
    // await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on Gemini guidelines
    const mockApiResponse = {
      text: JSON.stringify({
        pattern: "You've mentioned 'solar study motivation' 3 times this week, especially on Tuesdays.",
        insight: "Your energy seems to dip midweek. Let's try scheduling a rewarding activity after your Tuesday study session to create a positive feedback loop.",
        redundancy_alert: null,
        first_principles_question: "What is the absolute simplest way you could make studying solar fundamentals feel less like a chore and more like a game?",
      })
    };
    
    // REAL IMPLEMENTATION EXAMPLE
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze these journal entries and provide insights:\n${recentEntries}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        pattern: { type: Type.STRING, description: "A recurring pattern identified in the entries." },
                        insight: { type: Type.STRING, description: "A coaching message based on the pattern." },
                        redundancy_alert: { type: Type.STRING, description: "A flag for a repeated challenge, or null." },
                        first_principles_question: { type: Type.STRING, description: "A thought-provoking question based on the entries." }
                    },
                },
            },
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error fetching coaching insight from Gemini:", error);
        // Fallback to mock data on error
        return JSON.parse(mockApiResponse.text);
    }
};

export const generateSmartGoals = async (profile: UserProfile): Promise<Goal[]> => {
    const prompt = `
        Act as a high-performance life coach. Based on the user's profile, generate 3 distinct SMART goals.
        
        User Name: ${profile.name}
        Main Life Goal: "${profile.mainGoal}"
        Current Pillars Status:
        ${profile.pillars.map(p => `- ${p.name}: Score ${p.score}/${p.target}`).join('\n')}

        Generate goals that are Specific, Measurable, Achievable, Relevant, and Time-bound.
        Ensure the target dates are realistic (YYYY-MM-DD format).
        Assign each goal to one of these pillars: 'Health', 'Wealth', 'Relationships', 'General'.
        Status should always be 'Upcoming'.
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            targetDate: { type: Type.STRING, description: "ISO 8601 Date string YYYY-MM-DD" },
                            status: { type: Type.STRING, enum: ['Upcoming'] },
                            pillar: { type: Type.STRING, enum: ['Health', 'Wealth', 'Relationships', 'General'] },
                            keyMetrics: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        progress: { type: Type.NUMBER },
                                        target: { type: Type.NUMBER },
                                        unit: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                },
            },
        });

        const jsonStr = response.text.trim();
        const goals = JSON.parse(jsonStr);
        
        // Add client-side IDs
        return goals.map((g: any, index: number) => ({
            ...g,
            id: `ai-goal-${Date.now()}-${index}`
        }));

    } catch (error) {
        console.error("Error generating SMART goals:", error);
        return [];
    }
};
