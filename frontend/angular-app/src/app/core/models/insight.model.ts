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

export interface PalabraFrecuencia {
  palabra: string;
  frecuencia: number;
}

export interface RegistroTextual {
  id: number;
  fecha_reporte: string;
  mes: string;
  mes_num: number;
  tipo_pqrs_grupo: string;
  canal: string;
  ambito: string;
  area_solicitud: string;
  aseguradora: string;
  vencimiento: string;
  keywords: string[];
  texto_preview: string;
}

export interface Textual {
  disponible: boolean;
  detalle?: string;
  fecha_generacion?: string;
  total_registros_con_texto?: number;
  top_palabras?: {
    global: PalabraFrecuencia[];
    tipo: Record<string, PalabraFrecuencia[]>;
    ambito: Record<string, PalabraFrecuencia[]>;
    area_solicitud: Record<string, PalabraFrecuencia[]>;
  };
  registros?: RegistroTextual[];
}

export interface Filtros {
  tipos: string[];
  ambitos: string[];
  canales: string[];
  areas: string[];
  meses: Record<number, string>[];
}