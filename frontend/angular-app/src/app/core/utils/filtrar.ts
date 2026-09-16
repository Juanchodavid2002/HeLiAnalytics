import { FiltrosActivos } from '../services/filter.service';
import {
  Cruce,
  Distribuciones,
  DistribucionVariable,
  Frecuencia,
  TemporalMes,
} from '../models/distribucion.model';

export type VariableFiltro = 'tipos' | 'ambitos' | 'canales' | 'areas';

const MAPA_VARIABLE: Record<VariableFiltro, string> = {
  tipos: 'tipo_pqrs',
  ambitos: 'ambito',
  canales: 'canal',
  areas: 'area_solicitud',
};

export function filtrarFrecuencias(
  frecuencias: Frecuencia[],
  variable: VariableFiltro,
  filtros: FiltrosActivos,
): Frecuencia[] {
  const seleccionados = filtros[variable];
  if (!seleccionados || seleccionados.length === 0) {
    return frecuencias;
  }
  return frecuencias.filter((f) => seleccionados.includes(f.categoria));
}

export function filtrarMeses<T extends TemporalMes>(
  items: T[],
  filtros: FiltrosActivos,
): T[] {
  if (!filtros.meses || filtros.meses.length === 0) {
    return items;
  }
  return items.filter((m) => filtros.meses.includes(m.mes_num));
}

export function filtrarCruce(
  cruce: Cruce,
  filtros: FiltrosActivos,
): Cruce {
  const filtroX = cruce.variable_x === 'ambito' ? filtros.ambitos
    : cruce.variable_x === 'tipo_pqrs_grupo' ? filtros.tipos
    : cruce.variable_x === 'canal' ? filtros.canales
    : cruce.variable_x === 'area_solicitud' ? filtros.areas
    : [];
  const filtroY = cruce.variable_y === 'ambito' ? filtros.ambitos
    : cruce.variable_y === 'tipo_pqrs_grupo' ? filtros.tipos
    : cruce.variable_y === 'canal' ? filtros.canales
    : cruce.variable_y === 'area_solicitud' ? filtros.areas
    : [];

  return {
    ...cruce,
    tabla: cruce.tabla
      .filter((fila) => filtroX.length === 0 || filtroX.includes(fila.x))
      .map((fila) => ({
        ...fila,
        valores: fila.valores.filter(
          (v) => filtroY.length === 0 || filtroY.includes(v.y),
        ),
      })),
  };
}

export function nombreEtiquetaVariable(variable: string): string {
  return MAPA_VARIABLE[variable as VariableFiltro] ?? variable;
}

export interface Item {
  categoria: string;
  frecuencia: number;
  porcentaje: number;
}

export function variableDe(
  distribuciones: Distribuciones | null,
  nombre: string,
): DistribucionVariable | undefined {
  return distribuciones?.variables.find((v) => v.variable === nombre);
}

export function aItems(frecuencias: Frecuencia[]): Item[] {
  return frecuencias.map((f) => ({
    categoria: f.categoria,
    frecuencia: f.frecuencia,
    porcentaje: f.porcentaje,
  }));
}