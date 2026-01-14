
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
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-indigo-500/30">
      {/* Navbar */}
      <header className="border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/40 border border-indigo-400/20">
              <BrainIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">DocuMind AI</h1>
              <div className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Document Intelligence v1.1</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <span className="hover:text-white transition-colors cursor-pointer">Dashboard</span>
            <span className="hover:text-white transition-colors cursor-pointer">Advanced OCR</span>
            <span className="text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">Live Analysis</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 md:p-8">
        {!docState.analysis && !docState.isAnalyzing ? (
          <div className="flex flex-col items-center justify-center mt-20 space-y-16 animate-fadeIn">
            <div className="text-center space-y-6 max-w-3xl">
              <div className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
                Next-Gen NLP Processing
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-100 leading-[1.1] tracking-tight">
                Stop reading. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">Start interogating.</span>
              </h2>
              <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Unlock the dark data trapped in technical manuals, legal jargon, and research papers with zero latency.
              </p>
            </div>

            <div className="w-full max-w-2xl space-y-8">
              {/* Preferences Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-1.5 rounded-[1.5rem] border border-slate-800 flex shadow-inner">
                  <button 
                    onClick={() => setSummaryLength('brief')}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${summaryLength === 'brief' ? 'bg-indigo-600 text-white shadow-xl scale-100' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Brief
                  </button>
                  <button 
                    onClick={() => setSummaryLength('detailed')}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${summaryLength === 'detailed' ? 'bg-indigo-600 text-white shadow-xl scale-100' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Detailed
                  </button>
                </div>

                <div className="bg-slate-900/50 p-1.5 rounded-[1.5rem] border border-slate-800 flex shadow-inner">
                  <button 
                    onClick={() => setSummaryStyle('paragraph')}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${summaryStyle === 'paragraph' ? 'bg-indigo-600 text-white shadow-xl scale-100' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Narrative
                  </button>
                  <button 
                    onClick={() => setSummaryStyle('bullets')}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${summaryStyle === 'bullets' ? 'bg-indigo-600 text-white shadow-xl scale-100' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Key Points
                  </button>
                </div>
              </div>

              <label className="group relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-800 rounded-[2.5rem] hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all cursor-pointer overflow-hidden shadow-2xl">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-950 transition-all border border-slate-800 group-hover:border-indigo-500/30">
                    <FileIcon className="w-10 h-10 text-indigo-400" />
                  </div>
                  <p className="mb-2 text-lg text-slate-300">
                    Drop your <span className="font-bold text-indigo-400">Dreadful PDF</span> here
                  </p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Supports documents up to 50MB</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="application/pdf" 
                  onChange={handleFileUpload}
                />
              </label>
              {docState.error && (
                <p className="mt-4 text-center text-red-400 text-sm font-bold bg-red-950/20 py-3 rounded-2xl border border-red-900/30 animate-shake">
                  {docState.error}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Analysis Dashboard - Span 7 */}
            <div className="lg:col-span-7 space-y-8">
              {docState.isAnalyzing ? (
                <div className="h-[600px] flex flex-col items-center justify-center space-y-8 bg-slate-900/30 rounded-[2.5rem] border border-slate-800/50 shadow-inner">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BrainIcon className="w-8 h-8 text-indigo-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-tight">Extracting Knowledge...</h3>
                    <p className="text-slate-400 font-medium italic">
                      Synthesizing <span className="text-indigo-400">{summaryLength}</span> summary in <span className="text-indigo-400">{summaryStyle}</span> format.
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

            {/* Right Column: Chat Sidebar - Span 5 */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 h-fit space-y-6">
              <ChatInterface 
                messages={chatHistory} 
                onSendMessage={handleSendMessage} 
                isLoading={isChatting} 
              />
              
              {docState.analysis && (
                <div className="p-5 bg-slate-900/50 rounded-3xl border border-slate-800/60 shadow-lg group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                       <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Source Document</h4>
                       <p className="text-sm font-bold text-slate-100 truncate mt-1 max-w-[200px]">{docState.file?.name}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setDocState({ file: null, base64: null, analysis: null, isAnalyzing: false, error: null });
                        setDynamicSuggestions(null);
                      }}
                      className="text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-red-400 transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
                    >
                      New Document
                    </button>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                      <FileIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Metadata</p>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">{( (docState.file?.size || 0) / (1024 * 1024)).toFixed(2)} MB • PDF / Binary</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 bg-slate-950 mt-auto">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrainIcon className="w-6 h-6 text-indigo-500 opacity-80" />
            <span className="text-sm font-black tracking-widest uppercase text-slate-600">DocuMind AI</span>
          </div>
          <div className="text-slate-600 text-xs font-bold tracking-[0.1em] uppercase text-center md:text-right">
            Engineered with Gemini 3 Flash • Built for Performance • &copy; 2025
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
