
import React from 'react';
import { AnalysisData } from '../types';
import { ChartIcon, BrainIcon, SearchIcon } from './Icons';

interface AnalysisViewProps {
  data: AnalysisData;
  dynamicSuggestions: string[] | null;
  onAskQuestion: (q: string) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ data, dynamicSuggestions, onAskQuestion }) => {
  const suggestions = dynamicSuggestions || data.suggestedQuestions;
  const isDynamic = !!dynamicSuggestions;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Summary Section */}
      <section className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <BrainIcon className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Executive Summary</h2>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
            {data.summary}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Key Takeaways - Span 7 for more space */}
        <section className="lg:col-span-7 bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
             <h3 className="text-lg font-bold text-slate-100">Core Insights</h3>
          </div>
          <ul className="space-y-4 flex-1">
            {data.keyPoints.map((point, idx) => (
              <li key={idx} className="flex gap-4 group">
                <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-indigo-600/20 flex items-center justify-center text-xs font-bold text-indigo-300 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {idx + 1}
                </span>
                <span className="text-slate-300 text-base leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Document Pulse - Span 5, more condensed */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Sentiment & Tone</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-slate-200 font-medium text-lg">{data.sentiment.label}</span>
                <span className="text-indigo-400 font-mono text-sm">{data.sentiment.score}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/30">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-violet-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.4)]" 
                  style={{ width: `${data.sentiment.score}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                "{data.sentiment.description}"
              </p>
            </div>
          </div>

          <div className="bg-indigo-600/5 border border-indigo-500/20 p-6 rounded-3xl flex items-center justify-between">
            <div>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Complexity</span>
               <p className="text-2xl font-bold text-slate-100 mt-0.5">{data.complexity}</p>
            </div>
            <div className="p-3 bg-indigo-600/20 rounded-2xl">
               <ChartIcon className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
        </section>
      </div>

      {/* Entities Section */}
      <section className="bg-slate-800/20 backdrop-blur-sm p-6 rounded-3xl border border-slate-700/30">
        <h3 className="text-lg font-bold text-slate-100 mb-5 flex items-center gap-2">
          <SearchIcon className="w-5 h-5 text-indigo-400" />
          Mapping Entities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.entities.map((entity, idx) => (
            <div 
              key={idx} 
              className="group relative bg-slate-900/40 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700/50 transition-all cursor-help hover:-translate-y-1 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-400">
                  {entity.type}
                </span>
                <span className="text-slate-200 font-semibold truncate">{entity.name}</span>
              </div>
              <div className="pointer-events-none opacity-0 group-hover:opacity-100 absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-slate-900 text-sm text-slate-300 rounded-2xl shadow-2xl border border-slate-700 transition-opacity">
                <div className="relative">
                  {entity.significance}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mb-5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Questions */}
      <section className="space-y-4 p-8 bg-indigo-600/[0.03] rounded-3xl border border-dashed border-indigo-500/20">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            Explore Further
          </h4>
          {isDynamic && (
            <span className="text-[10px] bg-indigo-500 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
              Contextual AI
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {suggestions.map((q, idx) => (
            <button
              key={`${isDynamic ? 'dyn' : 'init'}-${idx}`}
              onClick={() => onAskQuestion(q)}
              className="text-left bg-slate-800/40 hover:bg-indigo-600 text-slate-300 hover:text-white p-4 rounded-2xl border border-slate-700/50 hover:border-indigo-400 transition-all text-sm group shadow-sm flex items-start gap-3"
            >
              <span className="mt-1 opacity-50 group-hover:opacity-100">→</span>
              <span className="font-medium">{q}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnalysisView;
