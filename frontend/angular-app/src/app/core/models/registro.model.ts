export interface RegistroAnalitico {
  id: number;
  fecha_reporte: string;
  mes: string;
  mes_num: number;
  tipo_pqrs: string;
  tipo_pqrs_grupo: string;
  canal: string;
  area_solicitud: string;
  ambito: string;
  tipo_usuario: string;
  aseguradora: string;
  regional: string;
  vencimiento: string;
  dias_respuesta: number;
}

export interface Registros {
  registros: RegistroAnalitico[];
}