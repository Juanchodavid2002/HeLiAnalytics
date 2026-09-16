export interface Frecuencia {
  categoria: string;
  frecuencia: number;
  porcentaje: number;
}

export interface DistribucionVariable {
  variable: string;
  total: number;
  con_nulos: number;
  frecuencias: Frecuencia[];
}

export interface Distribuciones {
  variables: DistribucionVariable[];
}

export interface TemporalMes {
  mes: string;
  mes_num: number;
  cantidad: number;
}

export interface TemporalMesTipo extends TemporalMes {
  tipos: Record<string, number>;
}

export interface Temporal {
  por_mes: TemporalMes[];
  por_mes_tipo: TemporalMesTipo[];
}

export interface CruceValor {
  y: string;
  frecuencia: number;
}

export interface Cruce {
  variable_x: string;
  variable_y: string;
  tabla: {
    x: string;
    valores: CruceValor[];
  }[];
}

export interface Cruces {
  cruces: Cruce[];
}

export interface BinTiempo {
  rango: string;
  frecuencia: number;
}

export interface TiempoRespuesta {
  media: number;
  mediana: number;
  desviacion: number;
  min: number;
  max: number;
  p25: number;
  p75: number;
  n_menor_igual_30: number;
  pct_menor_igual_30: number;
  distribucion_bins: BinTiempo[];
}