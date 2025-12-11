import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type ResumeKeywords = string[];

export class GeminiService {
  private apiKey: string | undefined;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-latest:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  }

  async analyzeResume(base64Pdf: string): Promise<ResumeKeywords> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    const prompt = `
      Analyze this resume PDF and extract relevant keywords for job matching. Return ONLY a JSON object with this exact structure:
      {
        "keywords": ["key1"]
      }

      Focus on:
      - Skills and Education mentioned
      - Job titles and roles
      - Industry experience
      - Certifications and qualifications
      - Experience level based on years of experience and seniority
      - Maximum 1 keyword
      - Only pick the most important core keyword that are essential for job matching

      Return ONLY the JSON object, no additional text or explanation.
    `;

    try {
      const genAI = new GoogleGenerativeAI(this.apiKey!);

      const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

      const response = await gemini.generateContent({
        contents: [{
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Pdf
              }
            }
          ]
        }],
        systemInstruction: {
          role: "system",
          parts: [{ text: prompt }]
        },
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      const data = await response.response;
      const content = await data.text()
      if (!content) {
        throw new Error('No content received from Gemini API');
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }

      if (!JSON.parse(content).keywords) {
        throw new Error('Some error occured!');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Error analyzing resume with Gemini:', error);
      throw new Error('Failed to analyze resume. Please try again.');
    }
  }
}