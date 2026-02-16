
export interface PhaseTime {
  phaseName: string;
  days: number;
  entryDate?: string;
  exitDate?: string;
}

export interface CreditRecord {
  id: string;
  cliente: string;
  faseActual: string;
  montoDOP: number;
  montoUSD: number;
  ejecutivo: string;
  tipoCredito: string;
  resultadoAnalisis: string;
  phases: PhaseTime[];
  raw: any; // Keep original row for debugging
}

export interface AnalysisSummary {
  totalClients: number;
  avgProcessTime: number;
  bottleneckPhase: string;
  totalMontoDOP: number;
}
