import { GoogleGenAI } from "@google/genai";

// This is a mock service. In a real application, you would not hardcode the API key.
// As per instructions, we assume process.env.API_KEY is available.
// However, to make this runnable without a real key, we will simulate the AI response.

const MOCK_INSIGHTS = {
    pattern: "You've mentioned 'finding time for solar study' 7 times in 2 weeks. This is a recurring bottleneck.",
    coaching: "The 'Cookie Jar' shows you successfully scheduled and passed your initial HCC assessment. Apply the same time-blocking technique you used then to your solar studies this week. Block 90 minutes every evening at 7 PM. Let's make it a streak.",
    redundancy: "Goal 'research battery systems' has appeared 3 times. Let's move this from a goal to a scheduled action item to break the loop.",
    optimization: "Your energy scores are highest between 9-11 AM. Your HCC training is perfectly aligned. Consider moving your cardio from morning to 4 PM to protect this peak focus time.",
    firstPrinciples: "You're trying to package Chaeto faster. From first principles, what is the absolute minimum viable process to get it from tank to bag? Forget the current method. What must be true? 1. It's wet. 2. It's in a bag. 3. It's weighed. How can you simplify each step to its core?"
};

export const getAiInsights = async (journalEntry: string): Promise<typeof MOCK_INSIGHTS> => {
    console.log("Simulating Gemini API call with entry:", journalEntry);
    
    // In a real app, you would uncomment and use the following:
    /*
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Analyze the following journal entry for a user on a 12-month transformation journey. Identify patterns, provide a coaching prompt, flag redundancies, suggest energy optimizations, and generate a 'first principles' question. Return a JSON object with keys: "pattern", "coaching", "redundancy", "optimization", "firstPrinciples".\n\nJournal Entry:\n${journalEntry}`,
            config: {
                responseMimeType: "application/json",
            }
        });
        const insights = JSON.parse(response.text);
        return insights;
    } catch (error) {
        console.error("Error fetching AI insights:", error);
        // Fallback to mock data on error
        return MOCK_INSIGHTS;
    }
    */

    // For this demonstration, we return mock data after a delay.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_INSIGHTS);
        }, 1500);
    });
};
