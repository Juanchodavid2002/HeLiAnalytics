import { FiltrosActivos } from '../services/filter.service';
import {
  Cruce,
  Distribuciones,
  DistribucionVariable,
  Frecuencia,
  TemporalMes,
  TemporalMesTipo,
  TemporalMesPrograma,
} from '../models/distribucion.model';

export type VariableFiltro = 'tipos' | 'causas' | 'canales' | 'servicios';

const MAPA_VARIABLE: Record<VariableFiltro, string> = {
  tipos: 'tipo_pqrs',
  causas: 'causa',
  canales: 'canal',
  servicios: 'programa',
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

export function filtrarTemporal(
  porMes: TemporalMes[],
  porMesTipo: TemporalMesTipo[],
  porProgramaMes: TemporalMesPrograma[],
  filtros: FiltrosActivos,
): { por_mes: TemporalMes[]; por_mes_tipo: TemporalMesTipo[]; por_programa_mes: TemporalMesPrograma[] } {
  return {
    por_mes: filtrarMeses(porMes || [], filtros),
    por_mes_tipo: filtrarMeses(porMesTipo || [], filtros),
    por_programa_mes: filtrarMeses(porProgramaMes || [], filtros),
  };
}

export function filtrarCruce(
  cruce: Cruce,
  filtros: FiltrosActivos,
): Cruce {
  const filtroX = cruce.variable_x === 'causa' ? filtros.causas
    : cruce.variable_x === 'tipo_pqrs_grupo' ? filtros.tipos
    : cruce.variable_x === 'canal' ? filtros.canales
    : cruce.variable_x === 'programa' ? filtros.servicios
    : [];
  const filtroY = cruce.variable_y === 'causa' ? filtros.causas
    : cruce.variable_y === 'tipo_pqrs_grupo' ? filtros.tipos
    : cruce.variable_y === 'canal' ? filtros.canales
    : cruce.variable_y === 'programa' ? filtros.servicios
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