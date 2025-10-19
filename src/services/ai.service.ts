import { GoogleGenAI, Type } from '@google/genai';
import { AVAILABLE_TAGS } from '../lib/constants';

let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
    console.error("API_KEY environment variable not set. AI features will be disabled.");
}

export const generateTitleFromDescription = async (description: string): Promise<string> => {
    if (!description.trim() || !ai) return '';
    try {
        const prompt = `Based on the following description, create a concise and professional title for a work order. Description: "${description}"`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text.replace(/["*]/g, '').trim();
    } catch (error) {
        console.error("AI Title Generation Error:", error);
        return '';
    }
};

export const generateTagsFromDescription = async (description: string): Promise<string[]> => {
    if (!description.trim() || !ai) return [];
     try {
        const prompt = `From the description, suggest up to 4 relevant tags from this list: ${AVAILABLE_TAGS.join(', ')}. Description: "${description}"`;
        const response = await ai.models.generateContent({ 
            model: 'gemini-2.5-flash', 
            contents: prompt,
            config: {
                 responseMimeType: "application/json",
                 responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        });
        const parsedTags = JSON.parse(response.text.trim());
        return parsedTags;
    } catch (error) {
        console.error("AI Tag Generation Error:", error);
        return [];
    }
};
