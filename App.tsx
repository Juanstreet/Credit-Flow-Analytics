
import React, { useState, useMemo } from 'react';
import { parseCSV } from './utils/csvParser';
import { CreditRecord } from './types';
import ClientCard from './components/ClientCard';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [records, setRecords] = useState<CreditRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError("⚠️ El archivo debe ser un .CSV (delimitado por comas). Si tienes un Excel (.xlsx), dale a 'Guardar como' y elige 'CSV'.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsedData = parseCSV(text);
          if (parsedData.length === 0) {
            setError("❌ No pudimos leer los datos. Asegúrate de que el archivo use los encabezados de la plantilla.");
          } else {
            setRecords(parsedData);
          }
        } catch (err) {
          setError("❌ Error técnico al procesar el archivo. Intenta de nuevo.");
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "Nombre del Cliente", "IDFase", "Fase actual", "Monto DOP Total Solicitado por el Cliente",
      "Tiempo total en Recepción Negocios (días)", "Tiempo total en Análisis (días)", 
      "Tiempo total en Dudas de Análisis (días)", "Tiempo total en Respuesta dudas análisis (días)",
      "Tiempo total en Aprobación Análisis (días)", "Tiempo total en Consideración (días)",
      "Tiempo total en Revisión Análisis (días)", "Tiempo total en Contratos (días)",
      "Tiempo total en Aprobación de Contratos (días)", "Tiempo total en Firma de Contrato y documentación p/desembolso (días)",
      "Tiempo total en Verificación para Desembolso (días)", "Tiempo total en Validación Garantías (días)",
      "Tiempo total en Liquidación de Operación (días)", "Correo del Ejecutivo de Negocios"
    ].join(",");
    
    const row = [
      "Empresa Ejemplo SA", "REC-001", "Análisis", "5000000",
      "1.5", "3", "0.5", "1", "2", "0", "0", "0", "0", "0", "0", "0", "0", "ejecutivo@banco.com"
    ].join(",");

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + row;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla_creditflow.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadDemoData = () => {
    const demoCSV = `Nombre del Cliente,Fase actual,Monto DOP Total Solicitado por el Cliente,Tiempo total en Recepción Negocios (días),Tiempo total en Análisis (días),Tiempo total en Contratos (días),Correo del Ejecutivo de Negocios\nJuan Perez,Análisis,1500000,2,5,0,pedro@banco.com\nMaria Rodriguez,Contratos,2800000,1,3,4,ana@banco.com\nTech Solutions SRL,Liquidación de Operación,12000000,3,10,2,luis@banco.com`;
    setRecords(parseCSV(demoCSV));
    setError(null);
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  const stats = useMemo(() => {
    if (records.length === 0) return null;
    const totalDOP = records.reduce((acc, r) => acc + r.montoDOP, 0);
    const avgTime = records.reduce((acc, r) => acc + r.phases.reduce((s, p) => s + p.days, 0), 0) / records.length;
    return { totalDOP, avgTime, count: records.length };
  }, [records]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50/50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                CreditFlow <span className="text-blue-600">Analytics</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {records.length > 0 && (
                <div className="relative hidden md:block w-64 lg:w-96">
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              )}
              <button onClick={() => setShowHelp(true)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {records.length === 0 ? (
          <div className="max-w-3xl mx-auto mt-12 text-center">
            <div className="bg-white p-8 sm:p-16 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
              <div className="inline-flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-3xl mb-8">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m-9 9h12a2 2 0 002-2V9a2 2 0 00-2-2h-3.172a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0011.172 5H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Analiza tus tiempos de crédito</h1>
              <p className="text-slate-500 mb-10 text-xl max-w-xl mx-auto leading-relaxed">
                Transforma tu reporte de Excel en un panel de control inteligente para detectar cuellos de botella al instante.
              </p>
              
              {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-semibold animate-bounce">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all cursor-pointer shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Subir mi Reporte (.CSV)
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={downloadTemplate} className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 px-6 py-4 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l4 4m-4-4h12" /></svg>
                    Bajar Plantilla
                  </button>
                  <button onClick={loadDemoData} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-4 rounded-2xl font-bold transition-all text-sm">
                    Ver Demo
                  </button>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 border-t border-slate-100 pt-8">
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Privacidad</p>
                  <p className="text-xs font-bold text-slate-600">Local (Sin Nube)</p>
                </div>
                <div className="text-center border-x border-slate-100 px-8">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Tecnología</p>
                  <p className="text-xs font-bold text-slate-600">IA Analítica</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Velocidad</p>
                  <p className="text-xs font-bold text-slate-600">Instantáneo</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Dashboard Headers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <p className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">En Trámite</p>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-slate-900">{stats?.count}</span>
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <p className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Días Promedio</p>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-slate-900">{stats?.avgTime.toFixed(1)}</span>
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <p className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Cartera Estimada</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-900">RD$ {(stats?.totalDOP ? stats.totalDOP / 1000000 : 0).toFixed(1)}M</span>
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <AIAssistant records={records} />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">Expedientes</h2>
              <button onClick={() => setRecords([])} className="text-xs font-bold text-rose-500 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100">Cerrar Sesión de Datos</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecords.map((record) => (
                <ClientCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Guía simplificada */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-6">¿Cómo usar CreditFlow?</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">1</div>
                <p className="text-slate-600 text-sm">Prepara tu Excel con los nombres de columnas de nuestra <strong>plantilla</strong>.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">2</div>
                <p className="text-slate-600 text-sm">Guárdalo como <strong>CSV</strong> (archivo delimitado por comas).</p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">3</div>
                <p className="text-slate-600 text-sm">Súbelo y usa el <strong>Asistente IA</strong> para que te diga dónde están los problemas.</p>
              </li>
            </ul>
            <button onClick={() => setShowHelp(false)} className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold">Cerrar Guía</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
