import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!); 

export async function analyzeDocument(base64Image: string, language: string, zipcode: string){
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a multilingual legal document assistant helping immigrants in Queens, New York understand official documents. Please take into account they might need very simple and elementary explanations. 

The user's native language is: ${language}
The user's zip code is: ${zipcode}

Analyze the document in the image carefully. Respond ONLY with valid JSON — no markdown, no backticks, no extra text:

{
  "document_type": "what kind of document this is (e.g. Eviction Notice, Utility Bill, Benefits Letter)",
  "translated_explanation": "clear simple explanation written entirely in ${language} — what it is, what it asks, why it matters, what happens if ignored, if anything needs to be filled in the page by them and if so what exactly, if this is a letter that typically requires to be notarized, etc",
  "next_steps": ["step 1 in ${language}", "step 2 in ${language}", "step 3 in ${language}"],
  "urgency": "low",
  "resource_keywords": ["keyword1", "keyword2"]
}

urgency must be exactly one of: low, medium, high
resource_keywords should be 2-3 plain English terms useful for finding local help (e.g. "legal aid", "housing court", "notary", "tax consultant", "immigration lawyer")`;

    const result = await model.generateContent([
        prompt, 
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, 
    ]);

    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
}