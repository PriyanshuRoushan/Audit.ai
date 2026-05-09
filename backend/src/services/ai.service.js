import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

export const generateAuditReport = async (responseData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are an expert Audit AI. Please analyze the following audit response data.
      Data: ${JSON.stringify(responseData)}

      Provide an evaluation in the following strict JSON format, without any markdown formatting:
      {
        "score": <a number from 0 to 100 based on the quality of the setup/responses>,
        "risk_level": "<one of: Low, Medium, High, Critical>",
        "summary": "<a concise 2-3 sentence summary of the audit>",
        "recommendations": [
          "<recommendation 1>",
          "<recommendation 2>",
          ...
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON output
    try {
      // Strip markdown block quotes if Gemini added them
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);
      return parsedData;
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON', text);
      // Fallback
      return {
        score: 50,
        risk_level: 'Medium',
        summary: 'Failed to properly analyze using AI due to formatting issues.',
        recommendations: ['Please review manually.']
      };
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    // Return a dummy fallback report if the API fails or no key is provided
    return {
      score: 75,
      risk_level: 'Low',
      summary: 'Placeholder AI summary. The Gemini API key may be missing or invalid.',
      recommendations: ['Check API Key', 'Configure Gemini properly']
    };
  }
};
