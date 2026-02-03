import { GoogleGenAI } from "@google/genai";
import { MetricData, RiskScore, LocationData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeGlacierRisk = async (
  location: LocationData,
  metrics: MetricData[],
  risk: RiskScore
): Promise<string> => {
  try {
    const prompt = `
      Act as a Glaciologist and Risk Assessment Expert. 
      Analyze the following data for a GLOF (Glacial Lake Outburst Flood) Risk Assessment system.

      Location: ${location.name} (${location.latitude}, ${location.longitude})
      Timestamp: ${location.lastUpdated}

      Current ML Model Predictions:
      ${metrics.map(m => `- ${m.label}: ${m.value}${m.unit} (Threshold: ${m.threshold}${m.unit}, Dangerous: ${m.isDangerous})`).join('\n')}

      Calculated Risk Score: ${risk.score} / 100 (Level: ${risk.level})
      Recent Change in Risk: +${risk.change}

      Provide a concise executive summary (max 150 words) describing the current situation. 
      Highlight the most critical factor contributing to the high risk score. 
      Recommend immediate actions if the risk is High or Critical.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Error generating risk analysis:", error);
    return "System Error: Unable to connect to AI analysis service.";
  }
};