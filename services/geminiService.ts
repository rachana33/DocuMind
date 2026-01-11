
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisData, SummaryLength, SummaryStyle, ChatResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "The requested executive summary of the document based on the user's preferred length and style." },
    keyPoints: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 5-8 most critical points found in the document."
    },
    entities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          significance: { type: Type.STRING }
        },
        required: ["name", "type", "significance"]
      }
    },
    sentiment: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Sentiment score from 0 (very negative) to 100 (very positive)." },
        label: { type: Type.STRING },
        description: { type: Type.STRING }
      },
      required: ["score", "label", "description"]
    },
    complexity: { type: Type.STRING, description: "Technical complexity level of the document." },
    suggestedQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 intelligent follow-up questions the user might want to ask."
    }
  },
  required: ["summary", "keyPoints", "entities", "sentiment", "complexity", "suggestedQuestions"]
};

const CHAT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    answer: { type: Type.STRING, description: "The direct answer to the user's question based on the PDF content." },
    followUpQuestions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3 intelligent, context-aware follow-up questions related specifically to the user's last question and the provided answer."
    }
  },
  required: ["answer", "followUpQuestions"]
};

export const analyzePdf = async (
  base64Data: string, 
  length: SummaryLength = 'brief', 
  style: SummaryStyle = 'paragraph'
): Promise<AnalysisData> => {
  const model = "gemini-3-flash-preview";
  
  const lengthInstruction = length === 'brief' 
    ? "Keep the summary concise (2-3 sentences)." 
    : "Provide a comprehensive, detailed executive summary (1-2 paragraphs).";
  
  const styleInstruction = style === 'bullets' 
    ? "Format the summary as a structured bulleted list within the summary string." 
    : "Format the summary as a cohesive narrative paragraph.";

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Data
          }
        },
        {
          text: `Analyze this document thoroughly and return a structured JSON report. 
          For the 'summary' field: ${lengthInstruction} ${styleInstruction}
          Focus on objective facts, key themes, and important entities. 
          Be critical if the content is technical or dense.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA
    }
  });

  try {
    return JSON.parse(response.text || '{}') as AnalysisData;
  } catch (err) {
    console.error("Failed to parse Gemini response", err);
    throw new Error("Analysis failed. The AI response was malformed.");
  }
};

export const chatWithPdf = async (
  base64Data: string, 
  userMessage: string, 
  history: { role: string, content: string }[]
): Promise<ChatResponse> => {
  const model = "gemini-3-flash-preview";

  const contents = [
    {
      role: 'user',
      parts: [
        { inlineData: { mimeType: "application/pdf", data: base64Data } },
        { text: `Based on the attached PDF, answer this question: "${userMessage}". Then, provide 3 follow-up questions that would help me explore this specific topic deeper.` }
      ]
    }
  ];

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: "You are a specialized document analysis assistant. Always return your response in JSON format. The 'answer' should be in clear Markdown format if it contains lists or tables. The 'followUpQuestions' should be a list of 3 strings.",
      responseMimeType: "application/json",
      responseSchema: CHAT_RESPONSE_SCHEMA
    }
  });

  try {
    return JSON.parse(response.text || '{}') as ChatResponse;
  } catch (err) {
    console.error("Failed to parse Gemini chat response", err);
    throw new Error("Chat response malformed.");
  }
};
