
import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAiInstance = () => {
  if (!aiInstance) {
    // These exact strings will be replaced by Vite during build/dev
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
      
    if (!apiKey) {
      throw new Error("Gemini API key is not set. Please ensure GEMINI_API_KEY is configured in your environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const analyzeRiskLevel = async (
  riskDescription: string,
  facts: string
): Promise<string> => {
  if (!riskDescription || riskDescription.length < 10) {
    return "Por favor ingrese una reseña de riesgo detallada para realizar el análisis.";
  }

  try {
    const ai = getAiInstance();
    const prompt = `
      Actúa como un experto analista de seguridad y riesgos para la Fiscalía General.
      Analiza la siguiente información de una solicitud de protección:
      
      Hechos: ${facts}
      Reseña del Riesgo: ${riskDescription}

      Por favor, provee un resumen conciso de 3 lineas y estima un nivel de riesgo (Bajo, Medio, Alto, Extremo) con una breve justificación.
      No uses formato Markdown, solo texto plano.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    if (error instanceof Error && error.message.includes("API key")) {
      return "Error: La clave de API de Gemini no está configurada correctamente.";
    }
    return "Error al conectar con el servicio de análisis de riesgo.";
  }
};
