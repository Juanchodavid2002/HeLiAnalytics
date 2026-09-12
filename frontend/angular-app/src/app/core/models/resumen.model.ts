export interface Resumen {
  total_pqrs: number;
  periodo: {
    inicio: string;
    fin: string;
  };
  distribucion_tipo: Record<string, number>;
  distribucion_tipo_grupo: Record<string, number>;
  causa_mas_frecuente: {
    categoria: string;
    frecuencia: number;
  };
  canal_mas_utilizado: {
    categoria: string;
    frecuencia: number;
  };
  servicio_mas_pqrs: {
    categoria: string;
    frecuencia: number;
  };
  tiempo_promedio_respuesta_dias: number;
  tiempo_mediana_respuesta_dias: number;
  tipo_usuario_mas_frecuente: {
    categoria: string;
    frecuencia: number;
  };
}