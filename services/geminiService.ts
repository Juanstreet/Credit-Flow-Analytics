
import { GoogleGenAI } from "@google/genai";
import { CreditRecord } from "../types";

export const analyzeCreditData = async (records: CreditRecord[], userQuery: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare a condensed version of data for the prompt to save tokens
  const condensedData = records.slice(0, 20).map(r => ({
    cliente: r.cliente,
    fase: r.faseActual,
    montoDOP: r.montoDOP,
    tiempos: r.phases.map(p => `${p.phaseName}: ${p.days}d`).join(', ')
  }));

  const prompt = `
    Eres un analista experto en banca y riesgos. Tienes los siguientes datos de expedientes de crédito:
    ${JSON.stringify(condensedData)}
    
    El usuario pregunta: "${userQuery}"
    
    Por favor, responde en español de manera profesional. Si detectas cuellos de botella (fases que duran mucho) o irregularidades, menciónalas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lo siento, hubo un error al procesar tu consulta con la IA.";
  }
};
