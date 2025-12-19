
import { GoogleGenAI } from "@google/genai";

// Use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRiskLevel = async (
  riskDescription: string,
  facts: string
): Promise<string> => {
  if (!riskDescription || riskDescription.length < 10) {
    return "Por favor ingrese una reseña de riesgo detallada para realizar el análisis.";
  }

  try {
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
    return "Error al conectar con el servicio de análisis de riesgo.";
  }
};
