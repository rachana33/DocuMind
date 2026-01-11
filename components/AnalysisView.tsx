
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
    <div className="space-y-8 animate-fadeIn">
      {/* Summary Section */}
      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <BrainIcon className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">Executive Summary</h2>
        </div>
        <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
          {data.summary}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Takeaways */}
        <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-semibold text-indigo-300 mb-4">Key Takeaways</h3>
          <ul className="space-y-3">
            {data.keyPoints.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-slate-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-900/50 flex items-center justify-center text-xs text-indigo-200">
                  {idx + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Sentiment & Metrics */}
        <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-semibold text-indigo-300 mb-4">Document Pulse</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-slate-400">Tone: <span className="text-slate-200 font-medium">{data.sentiment.label}</span></span>
                <span className="text-slate-400">{data.sentiment.score}% Positive</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000" 
                  style={{ width: `${data.sentiment.score}%` }}
                ></div>
              </div>
              <p className="mt-3 text-sm text-slate-400 italic">
                {data.sentiment.description}
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Complexity Level</span>
              <p className="text-xl font-semibold text-slate-200 mt-1">{data.complexity}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Entities Section */}
      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-semibold text-indigo-300 mb-4">Significant Entities</h3>
        <div className="flex flex-wrap gap-3">
          {data.entities.map((entity, idx) => (
            <div 
              key={idx} 
              className="group relative bg-slate-700/50 hover:bg-slate-700 p-3 rounded-lg border border-slate-600 transition-colors cursor-help"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-900/50 text-indigo-300">
                  {entity.type}
                </span>
                <span className="text-slate-200 font-medium">{entity.name}</span>
              </div>
              <div className="hidden group-hover:block absolute z-10 bottom-full mb-2 left-0 w-64 p-3 bg-slate-900 text-sm text-slate-300 rounded-lg shadow-xl border border-slate-700">
                {entity.significance}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Questions */}
      <section className="space-y-3 p-6 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <SearchIcon className="w-3 h-3" />
            {isDynamic ? 'Intelligent Follow-ups' : 'Recommended Questions'}
          </h4>
          {isDynamic && (
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 font-bold uppercase animate-pulse">
              Context Aware
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((q, idx) => (
            <button
              key={`${isDynamic ? 'dyn' : 'init'}-${idx}`}
              onClick={() => onAskQuestion(q)}
              className="text-left bg-indigo-600/5 hover:bg-indigo-600/20 text-indigo-300 px-4 py-2.5 rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-sm group"
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform">{q}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnalysisView;
