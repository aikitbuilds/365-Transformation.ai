import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Pillar } from '../types';

interface OnboardingInput {
    name: string;
    mainGoal: string;
    pillars: Pillar[];
}

const mockPlan = {
    title: "Michael's 30-Day Foundation Plan",
    steps: [
        "Week 1: Establish a non-negotiable morning routine (5:30 AM wake-up, meditation). Document energy levels daily.",
        "Week 2: Systematize your side-business workflow. Track time spent vs. revenue for each product (Lion's Mane, Chaeto).",
        "Week 3: Schedule and complete two informational interviews with solar professionals on LinkedIn.",
        "Week 4: Review all data from the past 3 weeks. Identify one major bottleneck and apply a 'First Principles' solution."
    ]
};


export const getOnboardingPlan = async (input: OnboardingInput): Promise<any> => {
    
    const prompt = `
        As an elite performance coach, create a concise, actionable 4-week starting plan for a user named ${input.name}.
        Their main goal is: "${input.mainGoal}".
        Their current life pillar scores are:
        - Health: ${input.pillars[0].score}/${input.pillars[0].target}
        - Wealth: ${input.pillars[1].score}/${input.pillars[1].target}
        - Relationships: ${input.pillars[2].score}/${input.pillars[2].target}

        The plan should focus on building foundational habits and systems.
        Provide a title for the plan and a list of 4 weekly action steps.
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A catchy title for the 4-week plan." },
                        steps: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "A list of exactly 4 strings, one for each week's action step."
                        }
                    },
                },
            },
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error fetching onboarding plan from Gemini:", error);
        // Fallback to mock data on error
        return mockPlan;
    }
};