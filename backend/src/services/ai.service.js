import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

export const generateAuditReport = async (auditData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are an AI audit engine.

      Analyze:
      Website: ${auditData.website || 'unknown'}
      User Input: ${JSON.stringify(auditData.responseData || {})}
      AI Usage Score: ${auditData.aiUsageScore || 50}

      Return ONLY valid JSON format, without any markdown formatting:
      {
        "score": <number from 0 to 100>,
        "risk_level": "<Low|Medium|High|Critical>",
        "summary": "<a concise 2-3 sentence summary of the audit>",
        "ai_usage_score": ${auditData.aiUsageScore || 50},
        "issues": [
          "<issue 1>",
          "<issue 2>"
        ],
        "recommendations": [
          "<recommendation 1>",
          "<recommendation 2>"
        ],
        "seo_notes": "<seo observations>",
        "performance_notes": "<performance observations>"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);
      return parsedData;
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON', text);
      return {
        score: 50,
        risk_level: 'Medium',
        summary: 'Failed to properly analyze using AI due to formatting issues.',
        ai_usage_score: auditData.aiUsageScore || 50,
        issues: ['Could not parse AI output.'],
        recommendations: ['Please review manually.'],
        seo_notes: '',
        performance_notes: ''
      };
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      score: 75,
      risk_level: 'Low',
      summary: 'Placeholder AI summary. API key may be missing or invalid.',
      ai_usage_score: auditData.aiUsageScore || 50,
      issues: ['API Error'],
      recommendations: ['Check API Key', 'Configure Gemini properly'],
      seo_notes: '',
      performance_notes: ''
    };
  }
};

