
import React, { useState } from 'react';
import { analyzeCreditData } from '../services/geminiService';
import { CreditRecord } from '../types';

interface AIAssistantProps {
  records: CreditRecord[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ records }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query) return;
    setLoading(true);
    const result = await analyzeCreditData(records, query);
    setResponse(result || '');
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight">Asistente IA de Créditos</h2>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Haz preguntas sobre tus datos, identifica cuellos de botella o solicita un resumen de la cartera.
      </p>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: ¿Qué fase está retrasando más los procesos?"
            className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder:text-slate-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            {loading ? 'Analizando...' : 'Preguntar'}
          </button>
        </div>

        {response && (
          <div className="mt-4 p-4 bg-slate-800 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-start gap-2">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.001 8.001 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
                <div className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {response}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
