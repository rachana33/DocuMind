
import React, { useState, useCallback } from 'react';
import { analyzePdf, chatWithPdf } from './services/geminiService';
import { DocumentState, ChatMessage, AnalysisData, SummaryLength, SummaryStyle } from './types';
import { FileIcon, BrainIcon, SendIcon } from './components/Icons';
import AnalysisView from './components/AnalysisView';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [docState, setDocState] = useState<DocumentState>({
    file: null,
    base64: null,
    analysis: null,
    isAnalyzing: false,
    error: null,
  });

  const [summaryLength, setSummaryLength] = useState<SummaryLength>('brief');
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>('paragraph');

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[] | null>(null);
  const [isChatting, setIsChatting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setDocState(prev => ({ ...prev, error: "Please upload a valid PDF file." }));
      return;
    }

    setDocState({
      file,
      base64: null,
      analysis: null,
      isAnalyzing: true,
      error: null
    });

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        try {
          const analysis = await analyzePdf(base64, summaryLength, summaryStyle);
          setDocState({
            file,
            base64,
            analysis,
            isAnalyzing: false,
            error: null
          });
          setChatHistory([]); 
          setDynamicSuggestions(null); // Reset suggestions for new doc
        } catch (err: any) {
          setDocState(prev => ({ 
            ...prev, 
            isAnalyzing: false, 
            error: err.message || "Something went wrong during analysis." 
          }));
        }
      };
      reader.onerror = () => {
        setDocState(prev => ({ ...prev, isAnalyzing: false, error: "Failed to read file." }));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setDocState(prev => ({ ...prev, isAnalyzing: false, error: "File processing error." }));
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!docState.base64) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsChatting(true);

    try {
      const historyItems = chatHistory.map(m => ({ role: m.role, content: m.content }));
      const chatResult = await chatWithPdf(docState.base64, content, historyItems);
      
      const modelMsg: ChatMessage = {
        role: 'model',
        content: chatResult.answer,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, modelMsg]);
      setDynamicSuggestions(chatResult.followUpQuestions);
    } catch (err) {
      setChatHistory(prev => [...prev, {
        role: 'model',
        content: "I'm sorry, I encountered an error while answering. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <BrainIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">DocuMind AI</h1>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">PDF Intelligence Engine</p>
            </div>
          </div>
          
          <div className="hidden md:block text-slate-400 text-sm italic">
            "Transforming dreadful PDFs into clarity."
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {!docState.analysis && !docState.isAnalyzing ? (
          <div className="flex flex-col items-center justify-center mt-12 space-y-12 animate-fadeIn">
            <div className="text-center space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-100 leading-tight">
                Analyze your <span className="text-indigo-400">longest</span> and <span className="text-indigo-400">dreadfullest</span> PDFs in seconds.
              </h2>
              <p className="text-slate-400 text-lg">
                Upload any technical document, legal contract, or research paper. 
                Configure your preference below and start the magic.
              </p>
            </div>

            <div className="w-full max-w-xl space-y-8">
              {/* Preferences Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-1 rounded-2xl border border-slate-700 flex">
                  <button 
                    onClick={() => setSummaryLength('brief')}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${summaryLength === 'brief' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Brief
                  </button>
                  <button 
                    onClick={() => setSummaryLength('detailed')}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${summaryLength === 'detailed' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Detailed
                  </button>
                </div>

                <div className="bg-slate-800/40 p-1 rounded-2xl border border-slate-700 flex">
                  <button 
                    onClick={() => setSummaryStyle('paragraph')}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${summaryStyle === 'paragraph' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Paragraph
                  </button>
                  <button 
                    onClick={() => setSummaryStyle('bullets')}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${summaryStyle === 'bullets' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Bullets
                  </button>
                </div>
              </div>

              <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-800/30 transition-all cursor-pointer overflow-hidden">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-950 transition-all">
                    <FileIcon className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="mb-2 text-sm text-slate-300">
                    <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">PDF documents only (max 20MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="application/pdf" 
                  onChange={handleFileUpload}
                />
              </label>
              {docState.error && (
                <p className="mt-4 text-center text-red-400 text-sm font-medium bg-red-900/10 py-2 rounded-lg border border-red-900/20">
                  {docState.error}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Analysis Dashboard */}
            <div className="lg:col-span-8 space-y-8">
              {docState.isAnalyzing ? (
                <div className="h-96 flex flex-col items-center justify-center space-y-6 bg-slate-800/20 rounded-3xl border border-slate-800/50">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BrainIcon className="w-6 h-6 text-indigo-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-100">Analyzing Document...</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Crafting your <span className="text-indigo-400 font-bold">{summaryLength} {summaryStyle}</span> summary.
                    </p>
                  </div>
                </div>
              ) : docState.analysis ? (
                <AnalysisView 
                  data={docState.analysis} 
                  dynamicSuggestions={dynamicSuggestions}
                  onAskQuestion={handleSendMessage} 
                />
              ) : null}
            </div>

            {/* Right Column: Chat Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
              <ChatInterface 
                messages={chatHistory} 
                onSendMessage={handleSendMessage} 
                isLoading={isChatting} 
              />
              
              {docState.analysis && (
                <div className="mt-4 p-4 bg-indigo-900/10 rounded-xl border border-indigo-900/20">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Active Document</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase">
                      {summaryLength}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-950 rounded-lg">
                      <FileIcon className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div className="truncate flex-1">
                      <p className="text-sm font-medium text-slate-200 truncate">{docState.file?.name}</p>
                      <p className="text-[10px] text-slate-500">{((docState.file?.size || 0) / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={() => {
                        setDocState({ file: null, base64: null, analysis: null, isAnalyzing: false, error: null });
                        setDynamicSuggestions(null);
                      }}
                      className="text-xs text-slate-500 hover:text-red-400 font-medium transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <BrainIcon className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-tight">DocuMind AI</span>
          </div>
          <div className="text-slate-500 text-xs">
            Powered by Gemini 3 Flash • Tailored {summaryLength} {summaryStyle} Analysis
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
