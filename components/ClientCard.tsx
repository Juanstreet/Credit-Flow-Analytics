
import React from 'react';
import { CreditRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ClientCardProps {
  record: CreditRecord;
}

const ClientCard: React.FC<ClientCardProps> = ({ record }) => {
  const totalDays = record.phases.reduce((sum, p) => sum + p.days, 0);

  const copyDetails = () => {
    const text = `
Resumen de Crédito: ${record.cliente}
Fase Actual: ${record.faseActual}
Total Días en Proceso: ${totalDays.toFixed(1)}
Monto: RD$ ${record.montoDOP.toLocaleString()}
Ejecutivo: ${record.ejecutivo}
    `.trim();
    
    navigator.clipboard.writeText(text);
    alert("¡Resumen copiado al portapapeles!");
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="max-w-[70%]">
            <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{record.cliente}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{record.id}</p>
          </div>
          <div className={`shrink-0 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
            record.faseActual.toLowerCase().includes('aprobado') || record.faseActual.toLowerCase().includes('liquid') 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-blue-50 text-blue-700'
          }`}>
            {record.faseActual.split(' ')[0]}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Días Totales</p>
            <p className="text-2xl font-black text-slate-800 leading-none">{totalDays.toFixed(0)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Monto DOP</p>
            <p className="text-xl font-black text-slate-800 leading-none">
              ${(record.montoDOP / 1000).toFixed(0)}k
            </p>
          </div>
        </div>

        <div className="h-44 w-full mb-4">
          <p className="text-[9px] text-slate-400 uppercase font-black mb-3">Distribución de Tiempos</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={record.phases} layout="vertical" margin={{ left: -30, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="phaseName" 
                width={80} 
                fontSize={8} 
                tick={{ fill: '#94a3b8', fontWeight: 600 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
              />
              <Bar dataKey="days" radius={[0, 10, 10, 0]} barSize={12}>
                {record.phases.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.days > 4 ? '#f43f5e' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-black">Ejecutivo</span>
          <span className="text-xs text-slate-600 font-medium truncate max-w-[120px]">{record.ejecutivo.split('@')[0]}</span>
        </div>
        <button 
          onClick={copyDetails}
          className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copiar Ficha
        </button>
      </div>
    </div>
  );
};

export default ClientCard;
