export interface ClusterTop {
  categoria: string;
  porcentaje: number;
}

export interface ClusterVarPerfil {
  moda: string;
  pct_moda: number;
  top: ClusterTop[];
}

export interface ClusterDiasRespuesta {
  media: number;
  mediana: number;
}

export interface ClusterPerfil {
  tipo_pqrs_grupo: ClusterVarPerfil;
  canal: ClusterVarPerfil;
  area_solicitud: ClusterVarPerfil;
  ambito: ClusterVarPerfil;
  dias_respuesta: ClusterDiasRespuesta;
}

export interface Cluster {
  id: number;
  cantidad: number;
  participacion_pct: number;
  perfil: ClusterPerfil;
  nombre: string;
  interpretacion: string;
  letra: string;
}

export interface MetricasCluster {
  costo_total: number;
}

export interface Clusters {
  algoritmo: string;
  num_clusters: number;
  gamma: number;
  variables_categoricas: string[];
  variables_numericas: string[];
  criterio_seleccion_k: string;
  metricas: MetricasCluster;
  clusters: Cluster[];
}