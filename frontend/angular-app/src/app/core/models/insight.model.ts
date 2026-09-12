export type TipoInsight = 'hallazgo' | 'prioridad' | 'oportunidad' | 'tendencia';

export interface Insight {
  tipo: TipoInsight;
  titulo: string;
  descripcion: string;
  metrica: string;
  valor: string;
  orden: number;
}

export interface Insights {
  insights: Insight[];
  fecha_generacion: string;
  total_registros_analizados: number;
  periodo: string;
}

export interface Textual {
  disponible: boolean;
  detalle?: string;
  top_palabras?: {
    palabra: string;
    frecuencia: number;
  }[];
  lang?: string;
}

export interface FiltroCluster {
  id: number;
  letra: string;
  nombre: string;
  cantidad: number;
}

export interface Filtros {
  tipos: string[];
  causas: string[];
  canales: string[];
  servicios: string[];
  meses: Record<number, string>[];
  clusters: FiltroCluster[];
}