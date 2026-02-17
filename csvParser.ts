
import { CreditRecord, PhaseTime } from '../types';

export const parseCSV = (csvText: string): CreditRecord[] => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Remove potential UTF-8 BOM and normalize headers
  const headers = lines[0].replace(/^\uFEFF/, '').split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const records: CreditRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV split (not handling commas inside quotes perfectly, but sufficient for this structure)
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
    
    const getVal = (headerName: string) => {
      const idx = headers.findIndex(h => h.toLowerCase() === headerName.toLowerCase());
      return idx !== -1 ? values[idx] : '';
    };

    const phases: PhaseTime[] = [
      { 
        phaseName: 'Recepción Negocios', 
        days: parseFloat(getVal('Tiempo total en Recepción Negocios (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Recepción Negocios'),
        exitDate: getVal('Primera vez que salida en la fase Recepción Negocios')
      },
      { 
        phaseName: 'Análisis', 
        days: parseFloat(getVal('Tiempo total en Análisis (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Análisis'),
        exitDate: getVal('Primera vez que salida en la fase Análisis')
      },
      { 
        phaseName: 'Dudas de Análisis', 
        days: parseFloat(getVal('Tiempo total en Dudas de Análisis (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Dudas de Análisis'),
        exitDate: getVal('Primera vez que salida en la fase Dudas de Análisis')
      },
      { 
        phaseName: 'Respuesta Dudas', 
        days: parseFloat(getVal('Tiempo total en Respuesta dudas análisis (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Respuesta dudas análisis'),
        exitDate: getVal('Primera vez que salida en la fase Respuesta dudas análisis')
      },
      { 
        phaseName: 'Aprobación Análisis', 
        days: parseFloat(getVal('Tiempo total en Aprobación Análisis (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Aprobación Análisis'),
        exitDate: getVal('Primera vez que salida en la fase Aprobación Análisis')
      },
      { 
        phaseName: 'Consideración', 
        days: parseFloat(getVal('Tiempo total en Consideración (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Consideración'),
        exitDate: getVal('Primera vez que salida en la fase Consideración')
      },
      { 
        phaseName: 'Revisión Análisis', 
        days: parseFloat(getVal('Tiempo total en Revisión Análisis (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Revisión Análisis'),
        exitDate: getVal('Primera vez que salida en la fase Revisión Análisis')
      },
      { 
        phaseName: 'Contratos', 
        days: parseFloat(getVal('Tiempo total en Contratos (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Contratos'),
        exitDate: getVal('Primera vez que salida en la fase Contratos')
      },
      { 
        phaseName: 'Aprobación Contratos', 
        days: parseFloat(getVal('Tiempo total en Aprobación de Contratos (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Aprobación de Contratos'),
        exitDate: getVal('Primera vez que salida en la fase Aprobación de Contratos')
      },
      { 
        phaseName: 'Firma y Documentación', 
        days: parseFloat(getVal('Tiempo total en Firma de Contrato y documentación p/desembolso (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Firma de Contrato y documentación p/desembolso'),
        exitDate: getVal('Primera vez que salida en la fase Firma de Contrato y documentación p/desembolso')
      },
      { 
        phaseName: 'Verificación Desembolso', 
        days: parseFloat(getVal('Tiempo total en Verificación para Desembolso (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Verificación para Desembolso'),
        exitDate: getVal('Primera vez que salida en la fase Verificación para Desembolso')
      },
      { 
        phaseName: 'Validación Garantías', 
        days: parseFloat(getVal('Tiempo total en Validación Garantías (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Validación Garantías'),
        exitDate: getVal('Primera vez que salida en la fase Validación Garantías')
      },
      { 
        phaseName: 'Liquidación', 
        days: parseFloat(getVal('Tiempo total en Liquidación de Operación (días)')) || 0,
        entryDate: getVal('Primera vez que entró en la fase Liquidación de Operación'),
        exitDate: getVal('Primera vez que salida en la fase Liquidación de Operación')
      }
    ];

    records.push({
      id: getVal('IDFase') || `REC-${i}`,
      cliente: getVal('Nombre del Cliente') || 'N/A',
      faseActual: getVal('Fase actual') || 'N/A',
      montoDOP: parseFloat(getVal('Monto DOP Total Solicitado por el Cliente')) || 0,
      montoUSD: parseFloat(getVal('Monto USD Total Solicitado por el Cliente')) || 0,
      ejecutivo: getVal('Correo del Ejecutivo de Negocios') || 'N/A',
      tipoCredito: getVal('Tipo de Crédito Personal') || getVal('Tipo de Crédito Comercial') || 'N/A',
      resultadoAnalisis: getVal('Resultado') || 'Pendiente',
      phases: phases.filter(p => p.days > 0 || p.entryDate), // Only show active/completed phases
      raw: values
    });
  }

  return records;
};
