
export type SummaryLength = 'brief' | 'detailed';
export type SummaryStyle = 'paragraph' | 'bullets';

export interface AnalysisData {
  summary: string;
  keyPoints: string[];
  entities: {
    name: string;
    type: string;
    significance: string;
  }[];
  sentiment: {
    score: number; // 0 to 100
    label: string;
    description: string;
  };
  complexity: string;
  suggestedQuestions: string[];
}

export interface ChatResponse {
  answer: string;
  followUpQuestions: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface DocumentState {
  file: File | null;
  base64: string | null;
  analysis: AnalysisData | null;
  isAnalyzing: boolean;
  error: string | null;
}
