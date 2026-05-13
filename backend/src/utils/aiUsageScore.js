import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

function fallbackScore(prompt) {
  let score = 50;

  if (prompt.includes("?")) score += 10;
  if (prompt.length > 80) score += 10;
  if (prompt.split(" ").length > 15) score += 10;
  if (/test|asdf|random/i.test(prompt)) score -= 30;

  return Math.max(0, Math.min(100, score));
}

export const getAiUsageScore = async (prompt) => {
  if (!prompt || typeof prompt !== 'string') {
    return { score: 0, reasoning: "No valid prompt provided." };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const geminiPrompt = `
      Rate this prompt on how effectively it uses AI from 0–100. Explain briefly.
      Format your response strictly as JSON with exactly two fields: "score" (a number) and "reasoning" (a string).
      No markdown, no backticks.
      Prompt: "${prompt}"
    `;

    const result = await model.generateContent(geminiPrompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);
      return {
        score: parsedData.score || fallbackScore(prompt),
        reasoning: parsedData.reasoning || "Generated score based on fallback logic due to missing reasoning field."
      };
    } catch (parseError) {
      console.error('Failed to parse AI Usage Score JSON:', parseError);
      return {
        score: fallbackScore(prompt),
        reasoning: "Generated using fallback logic due to parsing error."
      };
    }
  } catch (error) {
    console.error('Gemini API Error (AI Usage Score):', error);
    return {
      score: fallbackScore(prompt),
      reasoning: "Generated using fallback logic due to API error."
    };
  }
};
