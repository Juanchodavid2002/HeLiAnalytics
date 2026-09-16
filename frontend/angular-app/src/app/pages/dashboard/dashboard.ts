import { Component, computed, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { FilterService } from '../../core/services/filter.service';
import { KpiCard, KpiColor } from '../../shared/kpi-card/kpi-card';
import { ChartContainer } from '../../shared/chart-container/chart-container';
import { Loading } from '../../shared/loading/loading';
import { Resumen } from '../../core/models/resumen.model';
import { Distribuciones, Temporal } from '../../core/models/distribucion.model';
import {
  aItems,
  filtrarFrecuencias,
  filtrarMeses,
  variableDe,
} from '../../core/utils/filtrar';
import {
  formatearDias,
  formatearNumero,
  formatearPorcentaje,
  titleCase,
} from '../../core/utils/formatters';
import {
  opcionBarrasHorizontal,
  opcionBarrasVertical,
  opcionDonut,
  opcionLineasPorMes,
  opcionLineasPorTipo,
} from '../../core/utils/charts';

@Component({
  selector: 'app-dashboard',
  imports: [KpiCard, ChartContainer, Loading],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly api = inject(ApiService);
  protected readonly filtrosSvc = inject(FilterService);

  protected readonly resumen = signal<Resumen | null>(null);
  protected readonly distribuciones = signal<Distribuciones | null>(null);
  protected readonly temporal = signal<Temporal | null>(null);
  protected readonly hayError = signal(false);

  protected readonly cargando = computed(
    () => this.resumen() === null && this.temporal() === null && !this.hayError(),
  );

  constructor() {
    this.cargarDatos();
  }

  protected reintentar(): void {
    this.hayError.set(false);
    this.resumen.set(null);
    this.temporal.set(null);
    this.cargarDatos();
  }

  private cargarDatos(): void {
    combineLatest([
      this.api.getResumen(),
      this.api.getDistribuciones(),
      this.api.getTemporal(),
    ]).subscribe({
      next: ([resumen, distribuciones, temporal]) => {
        this.resumen.set(resumen);
        this.distribuciones.set(distribuciones);
        this.temporal.set(temporal);
        this.hayError.set(false);
      },
      error: () => this.hayError.set(true),
    });
  }

  protected readonly totalPqrs = computed(() => formatearNumero(this.resumen()?.total_pqrs));
  protected readonly periodo = computed(() => this.resumen()?.periodo);

  protected readonly kpis = computed<{
    titulo: string;
    valor: string;
    subtexto: string;
    icono: string;
    color: KpiColor;
  }[]>(() => {
    const r = this.resumen();
    if (!r) {
      return [];
    }
    const total = r.total_pqrs;
    const grupo = r.distribucion_tipo_grupo ?? {};
    const etiquetas: { clave: string; etiqueta: string; icono: string; color: KpiColor }[] = [
      { clave: 'RECLAMO', etiqueta: 'Reclamos', icono: 'doc', color: 'error' },
      { clave: 'QUEJA', etiqueta: 'Quejas', icono: 'alert', color: 'alerta' },
      { clave: 'PETICION', etiqueta: 'Peticiones', icono: 'doc', color: 'secondary' },
      { clave: 'FELICITACION', etiqueta: 'Felicitaciones', icono: 'chart', color: 'accent' },
    ];
    const detalles = etiquetas.map((e) => ({
      titulo: e.etiqueta,
      valor: formatearNumero(grupo[e.clave] ?? 0),
      subtexto: `${formatearPorcentaje(total > 0 ? ((grupo[e.clave] ?? 0) / total) * 100 : 0)} del total`,
      icono: e.icono,
      color: e.color,
    }));
    return [
      {
        titulo: 'Total PQRS analizadas',
        valor: formatearNumero(total),
        subtexto: 'II semestre 2025',
        icono: 'chart',
        color: 'primary',
      },
      ...detalles,
      {
        titulo: 'Tiempo promedio de respuesta',
        valor: formatearDias(r.tiempo_promedio_respuesta_dias),
        subtexto: `Mediana ${formatearDias(r.tiempo_mediana_respuesta_dias)}`,
        icono: 'clock',
        color: 'secondary',
      },
      {
        titulo: 'Ámbito más frecuente',
        valor: titleCase(r.ambito_mas_frecuente?.categoria),
        subtexto: `${formatearNumero(r.ambito_mas_frecuente?.frecuencia)} registros`,
        icono: 'alert',
        color: 'alerta',
      },
      {
        titulo: 'Canal más utilizado',
        valor: titleCase(r.canal_mas_utilizado?.categoria),
        subtexto: `${formatearNumero(r.canal_mas_utilizado?.frecuencia)} radicaciones`,
        icono: 'mail',
        color: 'primary',
      },
      {
        titulo: 'Área con más PQRS',
        valor: titleCase(r.area_mas_frecuente?.categoria),
        subtexto: `${formatearNumero(r.area_mas_frecuente?.frecuencia)} registros`,
        icono: 'hosp',
        color: 'accent',
      },
    ];
  });

  protected readonly opcionesTipo = computed(() => {
    const v = variableDe(this.distribuciones(), 'tipo_pqrs');
    if (!v) {
      return null;
    }
    const items = filtrarFrecuencias(v.frecuencias, 'tipos', this.filtrosSvc.filtros());
    const convertidos = aItems(items);
    return convertidos.length > 0 ? opcionBarrasVertical(convertidos) : null;
  });

  protected readonly opcionesTendencia = computed(() => {
    const t = this.temporal();
    if (!t) {
      return null;
    }
    const meses = filtrarMeses(t.por_mes, this.filtrosSvc.filtros());
    if (meses.length === 0) {
      return null;
    }
    return opcionLineasPorMes(meses);
  });

  protected readonly opcionesTendenciaTipo = computed(() => {
    const t = this.temporal();
    if (!t) {
      return null;
    }
    const meses = filtrarMeses(t.por_mes_tipo, this.filtrosSvc.filtros());
    if (meses.length === 0) {
      return null;
    }
    return opcionLineasPorTipo(meses);
  });

  protected readonly opcionesAreas = computed(() => {
    const v = variableDe(this.distribuciones(), 'area_solicitud');
    if (!v) {
      return null;
    }
    const items = filtrarFrecuencias(v.frecuencias, 'areas', this.filtrosSvc.filtros());
    const convertidos = aItems(items);
    return convertidos.length > 0 ? opcionBarrasHorizontal(convertidos) : null;
  });

  protected readonly opcionesCanal = computed(() => {
    const v = variableDe(this.distribuciones(), 'canal');
    if (!v) {
      return null;
    }
    const items = filtrarFrecuencias(v.frecuencias, 'canales', this.filtrosSvc.filtros());
    const convertidos = aItems(items);
    return convertidos.length > 0 ? opcionDonut(convertidos, 'PQRS') : null;
  });

  protected anchoProgresoTiempo(): number {
    const media = this.resumen()?.tiempo_promedio_respuesta_dias ?? 0;
    return Math.min(100, media * 10);
  }

  protected accentSoft(color: KpiColor): Record<string, string> {
    const mapa: Record<string, string> = {
      primary: 'rgba(124,58,237,0.1)',
      secondary: 'rgba(6,182,212,0.1)',
      accent: 'rgba(236,72,153,0.1)',
      alerta: 'rgba(245,158,11,0.1)',
      error: 'rgba(239,68,68,0.1)',
    };
    return { '--accent-soft': mapa[color] ?? 'rgba(37,99,235,0.1)' };
  }

  protected softFondo(color: KpiColor): string {
    const mapa: Record<string, string> = {
      primary: 'border-violet-100 bg-violet-50 text-violet-600',
      secondary: 'border-cyan-100 bg-cyan-50 text-cyan-600',
      accent: 'border-pink-100 bg-pink-50 text-pink-600',
      alerta: 'border-amber-100 bg-amber-50 text-amber-600',
      error: 'border-rose-100 bg-rose-50 text-rose-600',
    };
    return mapa[color] ?? 'border-blue-100 bg-blue-50 text-blue-600';
  }
}