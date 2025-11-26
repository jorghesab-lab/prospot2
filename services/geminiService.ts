import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Category } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define the schema for the structured response
const searchResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recommendedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 specific keywords related to the user's problem."
    },
    targetCategory: {
      type: Type.STRING,
      enum: Object.values(Category),
      description: "The single most relevant category from the provided list."
    },
    reasoning: {
      type: Type.STRING,
      description: "A short sentence explaining why this category was chosen based on the user's input."
    }
  },
  required: ["recommendedKeywords", "targetCategory", "reasoning"]
};

export const getIntelligentRecommendations = async (userQuery: string) => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: `User Search Query: "${userQuery}".
      
      Analyze the user's request. They are looking for a service, professional, or business.
      Map their request to one of the following exact categories: ${Object.values(Category).join(', ')}.
      If the request is ambiguous, pick the closest one.
      Provide keywords that would help filter a database of professionals.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: searchResponseSchema,
        temperature: 0.3, 
      }
    });

    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback in case of API error
    return {
      recommendedKeywords: [userQuery],
      targetCategory: Category.ALL,
      reasoning: "No se pudo conectar con el asistente inteligente."
    };
  }
};
