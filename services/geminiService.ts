
import { GoogleGenAI, Type } from "@google/genai";

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
    
    /*
    try {
        const result = JSON.parse(mockApiResponse.text);
        return result;
    } catch (error) {
        console.error("Error parsing mock AI response:", error);
        return {
            pattern: "Could not retrieve AI pattern.",
            insight: "Could not retrieve AI insight.",
            redundancy_alert: null,
            first_principles_question: "How can we ensure our data structures are robust?"
        };
    }
    */

    
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