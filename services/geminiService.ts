
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateBlogIdeas = async (topic: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 creative and engaging blog post titles about the topic: "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
          }
        }
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return parsed.ideas || [];

  } catch (error) {
    console.error("Error generating blog ideas:", error);
    return [];
  }
};

export const generateAiReply = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `A potential client sent the following message: "${message}". Draft a polite, professional, and friendly reply that acknowledges their message, expresses excitement about the potential collaboration, and says you will get back to them within 1-2 business days. Keep it concise.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating AI reply:", error);
    return "Could not generate a reply at this time.";
  }
};

export const improveText = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rewrite the following text to be more professional, engaging, and impactful for a personal portfolio website. Original text: "${text}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Error improving text:", error);
    return text;
  }
};
