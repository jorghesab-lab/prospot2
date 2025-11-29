
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Category } from '../types';

const apiKey = process.env.API_KEY || '';
// Initialize AI only if key exists to prevent immediate crash
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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

// Schema for Service Description Generation
const serviceContentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "A professional, attractive marketing description for the business (max 250 characters)."
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 5 SEO-optimized tags for this specific service."
    }
  },
  required: ["description", "tags"]
};

// --- FALLBACK / SIMULATION FUNCTIONS (Local Brain) ---

const getSimulatedRecommendations = (query: string) => {
    const lowerQuery = query.toLowerCase();
    let cat = Category.ALL;
    
    if (lowerQuery.includes('auto') || lowerQuery.includes('mecanico') || lowerQuery.includes('freno') || lowerQuery.includes('rueda')) cat = Category.AUTOMOTIVE;
    else if (lowerQuery.includes('luz') || lowerQuery.includes('cable') || lowerQuery.includes('enchufe')) cat = Category.HOME_REPAIR;
    else if (lowerQuery.includes('agua') || lowerQuery.includes('caño') || lowerQuery.includes('gas')) cat = Category.HOME_REPAIR;
    else if (lowerQuery.includes('diente') || lowerQuery.includes('dolor') || lowerQuery.includes('medico')) cat = Category.HEALTH;
    else if (lowerQuery.includes('compu') || lowerQuery.includes('pc') || lowerQuery.includes('celular')) cat = Category.TECHNOLOGY;
    else if (lowerQuery.includes('evento') || lowerQuery.includes('dj') || lowerQuery.includes('fiesta')) cat = Category.EVENTS;
    else if (lowerQuery.includes('clase') || lowerQuery.includes('profe')) cat = Category.EDUCATION;
    else if (lowerQuery.includes('contador') || lowerQuery.includes('impuesto')) cat = Category.BUSINESS;

    return {
        recommendedKeywords: [query, "Servicio Local", "Mendoza", cat],
        targetCategory: cat,
        reasoning: "Modo Simulado: Análisis de palabras clave locales."
    };
};

const getSimulatedServiceContent = (businessName: string, category: string, title: string) => {
    return {
        description: `En ${businessName} nos especializamos en ${category}. Ofrecemos servicios de ${title} con la mejor atención y calidad en Mendoza. Contáctanos para recibir asesoramiento personalizado y soluciones rápidas.`,
        tags: [category, "Mendoza", "Profesional", "Calidad", "Confianza"]
    };
};

// --- MAIN EXPORTED FUNCTIONS ---

export const getIntelligentRecommendations = async (userQuery: string) => {
  if (!ai) return getSimulatedRecommendations(userQuery);

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

    return response.text ? JSON.parse(response.text) : getSimulatedRecommendations(userQuery);
  } catch (error) {
    console.warn("Gemini API Error (Falling back to local):", error);
    return getSimulatedRecommendations(userQuery);
  }
};

export const generateServiceContent = async (businessName: string, category: string, title: string) => {
  if (!ai) return getSimulatedServiceContent(businessName, category, title);

  try {
     const model = 'gemini-2.5-flash';
     const response = await ai.models.generateContent({
       model,
       contents: `Generate a professional business description and tags for a service provider app.
       Business Name: "${businessName}"
       Title/Service: "${title}"
       Category: "${category}"
       
       Context: This is for a local directory app in Mendoza, Argentina. The tone should be professional but trustworthy.
       Language: Spanish.`,
       config: {
         responseMimeType: "application/json",
         responseSchema: serviceContentSchema,
         temperature: 0.7
       }
     });

     return response.text ? JSON.parse(response.text) : getSimulatedServiceContent(businessName, category, title);
  } catch (error) {
    console.warn("Gemini API Error (Falling back to local):", error);
    return getSimulatedServiceContent(businessName, category, title);
  }
};
