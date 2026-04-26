import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!); 

export async function analyzeDocument(base64Image: string, language: string, zipcode: string){
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a multilingual document assistant for immigrants in Queens, NY. Be extremely brief and simple.

User language: ${language}
User ZIP: ${zipcode}

Respond ONLY with valid JSON — no markdown, no backticks, no extra text:

{
  "document_type": "document name only (e.g. Eviction Notice, Utility Bill)",
  "translated_explanation": "2-3 short sentences in ${language} only. What it is, what it wants, and what happens if ignored. Max 60 words.",
  "next_steps": ["short action phrase in ${language}", "short action phrase in ${language}", "short action phrase in ${language}"],
  "urgency": "low",
  "resource_keywords": ["keyword1", "keyword2"]
}

urgency must be exactly one of: low, medium, high
next_steps: max 3 items, each under 8 words, action-oriented (e.g. "Pay bill by October 15")
resource_keywords: 2 plain English terms for finding local help`;

    const result = await model.generateContent([
        prompt, 
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, 
    ]);

    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
}