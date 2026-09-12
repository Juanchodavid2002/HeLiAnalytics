import { EChartsOption } from 'echarts';

import { Cruce, TemporalMes, TemporalMesTipo } from '../models/distribucion.model';
import { Item } from './filtrar';
import { formatearNumero } from './formatters';

export const PALETA = [
  '#2563EB',
  '#0D9488',
  '#F59E0B',
  '#DC2626',
  '#7C3AED',
  '#0EA5E9',
  '#F97316',
  '#84CC16',
  '#14B8A6',
  '#6366F1',
];

const OPCIONES_BASE: EChartsOption = {
  textStyle: {
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#64748B',
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    textStyle: { color: '#1E293B', fontSize: 12 },
    extraCssText: 'box-shadow: 0 8px 24px rgba(15,23,42,.12); border-radius: 10px;',
  },
  grid: {
    left: 12,
    right: 16,
    top: 36,
    bottom: 12,
    containLabel: true,
  },
};

function baseConAxis(): EChartsOption {
  return JSON.parse(JSON.stringify(OPCIONES_BASE));
}

export function opcionBarrasVertical<T extends Item>(
  items: T[],
  color: string = PALETA[0],
  superior?: string,
): EChartsOption {
  const opciones = baseConAxis();
  return {
    ...opciones,
    tooltip: {
      ...opciones.tooltip,
      trigger: 'axis',
      formatter: (params: unknown) => {
        const lista = Array.isArray(params) ? params : [params];
        return lista
          .map((p) => {
            const it = (p as { dataIndex: number }).dataIndex;
            const el = items[it];
            return `<strong>${el.categoria}</strong><br/>${formatearNumero(el.frecuencia)} registros (${el.porcentaje.toLocaleString('es-CO', { maximumFractionDigits: 1 })}%)`;
          })
          .join('<br/>');
      },
    },
    grid: { ...opciones.grid, top: superior === undefined ? 24 : 50 },
    legend: superior ? { top: 0, data: [superior] } : undefined,
    xAxis: {
      type: 'category',
      data: items.map((i) => i.categoria),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748B', fontSize: 11, interval: 0, rotate: items.length > 5 ? 25 : 0 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748B', fontSize: 11 },
    },
    series: [
      {
        data: items.map((i) => i.frecuencia),
        type: 'bar',
        name: superior,
        itemStyle: {
          color,
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 44,
      },
    ],
  };
}

export function opcionBarrasHorizontal<T extends Item>(
  items: T[],
  altoSerie: number = 18,
): EChartsOption {
  const ordenados = [...items].sort((a, b) => a.frecuencia - b.frecuencia);
  const opciones = baseConAxis();
  return {
    ...opciones,
    tooltip: {
      ...opciones.tooltip,
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { dataIndex: number; value: number };
        const el = ordenados[p.dataIndex];
        return `<strong>${el.categoria}</strong><br/>${formatearNumero(el.frecuencia)} registros (${el.porcentaje.toLocaleString('es-CO', { maximumFractionDigits: 1 })}%)`;
      },
    },
    grid: { ...opciones.grid, left: 8, right: 40 },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748B', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: ordenados.map((i) => i.categoria),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#475569', fontSize: 11 },
    },
    series: [
      {
        data: ordenados.map((i) => i.frecuencia),
        type: 'bar',
        barMaxWidth: 22,
        showBackground: true,
        backgroundStyle: { color: '#f8fafc', borderRadius: 4 },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: PALETA[0] },
              { offset: 1, color: PALETA[4] },
            ],
          },
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: 'right',
          color: '#64748B',
          fontSize: 11,
          formatter: (p: unknown) => formatearNumero((p as { value: number }).value),
        },
      },
    ],
  };
}

export function opcionLineasPorMes(
  porMes: TemporalMes[],
  conArea: boolean = true,
): EChartsOption {
  const opciones = baseConAxis();
  return {
    ...opciones,
    tooltip: {
      ...opciones.tooltip,
      trigger: 'axis',
      formatter: (params: unknown) => {
        const p = (Array.isArray(params) ? params[0] : params) as { axisValue: string; value: number };
        return `<strong>${p.axisValue}</strong><br/>${formatearNumero(p.value)} PQRS`;
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: porMes.map((m) => m.mes),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748B', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748B', fontSize: 11 },
    },
    series: [
      {
        data: porMes.map((m) => m.cantidad),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: PALETA[0], width: 3 },
        itemStyle: { color: PALETA[0] },
        areaStyle: conArea
          ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(37,99,235,0.25)' },
                  { offset: 1, color: 'rgba(37,99,235,0.02)' },
                ],
              },
            }
          : undefined,
      },
    ],
  };
}

export function opcionLineasPorTipo(
  porMesTipo: TemporalMesTipo[],
): EChartsOption {
  const opciones = baseConAxis();
  const tipos = ordenTipos(porMesTipo);
  const colores = coloresPorTipo(tipos);
  return {
    ...opciones,
    tooltip: { ...opciones.tooltip, trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#64748B', fontSize: 11 } },
    grid: { ...opciones.grid, top: 40 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: porMesTipo.map((m) => m.mes),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748B', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748B', fontSize: 11 },
    },
    series: tipos.map((tipo) => ({
      name: tipoEtiqueta(tipo),
      type: 'line',
      smooth: true,
      symbolSize: 6,
      data: porMesTipo.map((m) => m.tipos[tipo] ?? 0),
      itemStyle: { color: colores[tipo] },
      lineStyle: { color: colores[tipo], width: 2.5 },
    })),
  };
}

export function opcionDonut<T extends Item>(
  items: T[],
  centroTitulo: string,
  colorBase: string = PALETA[0],
): EChartsOption {
  const total = items.reduce((acc, i) => acc + i.frecuencia, 0);
  const colores = items.map((_, idx) =>
    idx < PALETA.length ? PALETA[idx] : colorBase,
  );
  return {
    tooltip: {
      ...OPCIONES_BASE.tooltip,
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { name: string; value: number; percent: number };
        return `<strong>${p.name}</strong><br/>${formatearNumero(p.value)} registros (${p.percent.toLocaleString('es-CO', { maximumFractionDigits: 1 })}%)`;
      },
    },
    legend: {
      bottom: 0,
      type: 'scroll',
      textStyle: { color: '#64748B', fontSize: 11 },
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '78%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#ffffff', borderWidth: 2, borderRadius: 4 },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#1E293B',
            formatter: '{b}\n{d}%',
          },
        },
        data: items.map((i) => ({ name: i.categoria, value: i.frecuencia })).sort((a, b) => b.value - a.value),
        color: colores,
      },
    ],
graphic: [
    {
      type: 'text',
      left: 'center',
      top: '38%',
      style: {
        text: `${formatearNumero(total)}`,
        align: 'center',
        fontSize: 24,
        fontWeight: 700,
        fontFamily: 'JetBrains Mono, monospace',
        fill: '#1E3A5F',
      },
    },
    {
      type: 'text',
      left: 'center',
      top: '52%',
      style: {
        text: centroTitulo,
        align: 'center',
        fontSize: 11,
        fill: '#64748B',
      },
    },
  ],
  };
}

export function opcionBarrasAgrupadas(
  cruce: Cruce,
  limiteSeries: number = 8,
): EChartsOption {
  const opciones = baseConAxis();
  const ejesX = cruce.tabla.map((fila) => fila.x);
  const valoresY = ordenYUnica(cruce);
  const visibles = valoresY.slice(0, limiteSeries);
  return {
    ...opciones,
    color: PALETA,
    tooltip: { ...opciones.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, type: 'scroll', textStyle: { color: '#64748B', fontSize: 11 } },
    grid: { ...opciones.grid, top: 42 },
    xAxis: {
      type: 'category',
      data: ejesX,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748B', fontSize: 11, interval: 0, rotate: ejesX.length > 5 ? 25 : 0 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748B', fontSize: 11 },
    },
    series: visibles.map((y, idx) => ({
      name: y,
      type: 'bar',
      barMaxWidth: 20,
      itemStyle: { color: PALETA[idx % PALETA.length], borderRadius: [3, 3, 0, 0] },
      data: cruce.tabla.map((fila) => {
        const v = fila.valores.find((item) => item.y === y);
        return v ? v.frecuencia : 0;
      }),
    })),
  };
}

export function opcionHeatmap(cruce: Cruce): EChartsOption {
  const ejesX = ordenYUnica(cruce);
  const ejesY = cruce.tabla.map((fila) => fila.x);
  const filas = cruce.tabla.map((fila) =>
    ejesX.map((y) => {
      const v = fila.valores.find((item) => item.y === y);
      return v ? v.frecuencia : 0;
    }),
  );
  const max = Math.max(1, ...filas.flat(), 1);
  const data: [number, number, number][] = [];
  filas.forEach((filaValores, i) => {
    filaValores.forEach((valor, j) => {
      if (valor > 0) {
        data.push([j, i, valor]);
      }
    });
  });
  return {
    ...baseConAxis(),
    tooltip: {
      ...OPCIONES_BASE.tooltip,
      position: 'top',
      formatter: (params: unknown) => {
        const p = params as { value: [number, number, number] };
        return `<strong>${ejesX[p.value[0]]}</strong> × <strong>${ejesY[p.value[1]]}</strong><br/>${formatearNumero(p.value[2])} registros`;
      },
    },
    grid: { left: 12, right: 20, top: 20, bottom: 12, containLabel: true },
    xAxis: {
      type: 'category',
      data: ejesX,
      splitArea: { show: true, areaStyle: { color: ['#ffffff', '#f8fafc'] } },
      axisLabel: { color: '#64748B', fontSize: 11, interval: 0, rotate: ejesX.length > 6 ? 35 : 0 },
    },
    yAxis: {
      type: 'category',
      data: ejesY,
      splitArea: { show: true, areaStyle: { color: ['#ffffff', '#f8fafc'] } },
      axisLabel: { color: '#475569', fontSize: 11 },
    },
    visualMap: {
      min: 0,
      max,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      itemHeight: 120,
      textStyle: { color: '#64748B', fontSize: 10 },
      inRange: {
        color: ['#e0f2fe', '#93c5fd', '#2563EB', '#1e3a8a'],
      },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: {
          show: true,
          fontSize: 10,
          color: '#1E293B',
          formatter: (p: unknown) => String((p as { value: number[] }).value[2]),
        },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,.2)' } },
      },
    ],
  };
}

export function opcionBarrasTiempo<T extends { rango: string; frecuencia: number }>(
  bins: T[],
): EChartsOption {
  const opciones = baseConAxis();
  return {
    ...opciones,
    tooltip: {
      ...opciones.tooltip,
      trigger: 'axis',
      formatter: (params: unknown) => {
        const p = (Array.isArray(params) ? params[0] : params) as { axisValue: string; value: number };
        return `<strong>${p.axisValue}</strong><br/>${formatearNumero(p.value)} PQRS`;
      },
    },
    xAxis: {
      type: 'category',
      data: bins.map((b) => b.rango),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748B', fontSize: 11, interval: 0, rotate: 20 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748B', fontSize: 11 },
    },
    series: [
      {
        data: bins.map((b) => b.frecuencia),
        type: 'bar',
        barMaxWidth: 40,
        itemStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#0D9488' }, { offset: 1, color: '#14B8A6' }] },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };
}

export function opcionBarrasPorcentaje(
  items: { categoria: string; porcentaje: number }[],
): EChartsOption {
  const ordenados = [...items].sort((a, b) => a.porcentaje - b.porcentaje);
  const opciones = baseConAxis();
  return {
    ...opciones,
    tooltip: {
      ...opciones.tooltip,
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { dataIndex: number; value: number };
        const el = ordenados[p.dataIndex];
        return `<strong>${el.categoria}</strong><br/>${el.porcentaje.toLocaleString('es-CO', { maximumFractionDigits: 1 })}%`;
      },
    },
    grid: { ...opciones.grid, left: 8, right: 46 },
    xAxis: {
      type: 'value',
      max: 100,
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748B', fontSize: 11, formatter: '{value}%' },
    },
    yAxis: {
      type: 'category',
      data: ordenados.map((i) => i.categoria),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#475569', fontSize: 11 },
    },
    series: [
      {
        data: ordenados.map((i) => i.porcentaje),
        type: 'bar',
        barMaxWidth: 18,
        showBackground: true,
        backgroundStyle: { color: '#f8fafc', borderRadius: 4 },
        itemStyle: { color: '#0D9488', borderRadius: [0, 4, 4, 0] },
        label: {
          show: true,
          position: 'right',
          color: '#64748B',
          fontSize: 11,
          formatter: (p: unknown) =>
            `${(p as { value: number }).value.toLocaleString('es-CO', { maximumFractionDigits: 1 })}%`,
        },
      },
    ],
  };
}

function ordenYUnica(cruce: Cruce): string[] {
  const mapa = new Map<string, number>();
  cruce.tabla.forEach((fila) =>
    fila.valores.forEach((v) => mapa.set(v.y, (mapa.get(v.y) ?? 0) + v.frecuencia)),
  );
  return [...mapa.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([y]) => y);
}

function ordenTipos(porMesTipo: TemporalMesTipo[]): string[] {
  const totales = new Map<string, number>();
  porMesTipo.forEach((m) =>
    Object.entries(m.tipos ?? {}).forEach(([t, n]) => totales.set(t, (totales.get(t) ?? 0) + n)),
  );
  return [...totales.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

const ETIQUETAS_TIPO: Record<string, string> = {
  RECLAMO: 'Reclamo',
  'RECLAMO RIESGO SIMPLE': 'Reclamo Riesgo Simple',
  'RECLAMO RIESGO PRIORIZADO': 'Reclamo Riesgo Priorizado',
  'RECLAMO RIESGO VITAL': 'Reclamo Riesgo Vital',
  PETICION: 'Petición',
  'PETICIÓN': 'Petición',
  QUEJA: 'Queja',
  FELICITACION: 'Felicitación',
  'FELICITACIÓN': 'Felicitación',
  SUGERENCIA: 'Sugerencia',
};

const COLORES_TIPO: Record<string, string> = {
  RECLAMO: '#DC2626',
  QUEJA: '#F59E0B',
  PETICION: '#2563EB',
  'PETICIÓN': '#2563EB',
  FELICITACION: '#0D9488',
  'FELICITACIÓN': '#0D9488',
  SUGERENCIA: '#7C3AED',
};

export function tipoEtiqueta(tipo: string): string {
  return ETIQUETAS_TIPO[tipo] ?? tipo.toLowerCase();
}

export function coloresPorTipo(tipos: string[]): Record<string, string> {
  const mapa: Record<string, string> = {};
  tipos.forEach((t, idx) => {
    mapa[t] = COLORES_TIPO[t] ?? PALETA[idx % PALETA.length];
  });
  return mapa;
}