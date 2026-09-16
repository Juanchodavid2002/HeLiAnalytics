import { Component, computed, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { FilterService } from '../../core/services/filter.service';
import { KpiCard, KpiColor } from '../../shared/kpi-card/kpi-card';
import { ChartContainer } from '../../shared/chart-container/chart-container';
import { Loading } from '../../shared/loading/loading';
import { Resumen } from '../../core/models/resumen.model';
import { Distribuciones, Temporal } from '../../core/models/distribucion.model';
import { RegistroAnalitico } from '../../core/models/registro.model';
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
  protected readonly registros = signal<RegistroAnalitico[]>([]);
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
      this.api.getRegistros(),
    ]).subscribe({
      next: ([resumen, distribuciones, temporal, registros]) => {
        this.resumen.set(resumen);
        this.distribuciones.set(distribuciones);
        this.temporal.set(temporal);
        this.registros.set(registros.registros);
        this.hayError.set(false);
      },
      error: () => this.hayError.set(true),
    });
  }

  protected readonly periodo = computed(() => this.resumen()?.periodo);

  protected readonly filtrados = computed(() => {
    const regs = this.registros();
    if (!regs?.length) {
      return [];
    }
    const f = this.filtrosSvc.filtros();
    return regs.filter((r) =>
      (f.tipos.length === 0 || f.tipos.includes(r.tipo_pqrs_grupo)) &&
      (f.ambitos.length === 0 || f.ambitos.includes(r.ambito)) &&
      (f.canales.length === 0 || f.canales.includes(r.canal)) &&
      (f.areas.length === 0 || f.areas.includes(r.area_solicitud)) &&
      (f.meses.length === 0 || f.meses.includes(r.mes_num))
    );
  });

  protected readonly totalPqrs = computed(() => this.filtrados().length);

  protected readonly kpis = computed<{
    titulo: string;
    valor: string;
    subtexto: string;
    icono: string;
    color: KpiColor;
  }[]>(() => {
    const regs = this.filtrados();
    const total = regs.length;
    if (total === 0) {
      return [];
    }
    const grupo: Record<string, number> = {};
    const counts: Record<string, Record<string, number>> = { ambito: {}, canal: {}, area: {} };
    for (const r of regs) {
      grupo[r.tipo_pqrs_grupo] = (grupo[r.tipo_pqrs_grupo] ?? 0) + 1;
      counts['ambito'][r.ambito] = (counts['ambito'][r.ambito] ?? 0) + 1;
      counts['canal'][r.canal] = (counts['canal'][r.canal] ?? 0) + 1;
      counts['area'][r.area_solicitud] = (counts['area'][r.area_solicitud] ?? 0) + 1;
    }
    const media = regs.reduce((s, r) => s + r.dias_respuesta, 0) / total;
    const sorted = regs.map((r) => r.dias_respuesta).sort((a, b) => a - b);
    const mediana = total % 2 === 1
      ? sorted[(total - 1) / 2]
      : (sorted[total / 2 - 1] + sorted[total / 2]) / 2;
    const top = (obj: Record<string, number>) => {
      const [cat, freq] = Object.entries(obj).sort((a, b) => b[1] - a[1])[0] ?? ['-', 0];
      return { categoria: cat, frecuencia: freq };
    };
    const ambitoTop = top(counts['ambito']);
    const canalTop = top(counts['canal']);
    const areaTop = top(counts['area']);

    return [
      {
        titulo: 'Total PQRS analizadas',
        valor: formatearNumero(total),
        subtexto: total !== (this.resumen()?.total_pqrs ?? 0) ? `${formatearNumero(this.resumen()?.total_pqrs ?? 0)} global` : 'II semestre 2025',
        icono: 'chart',
        color: 'primary',
      },
      ...([
        { clave: 'RECLAMO', etiqueta: 'Reclamos', icono: 'doc', color: 'error' },
        { clave: 'QUEJA', etiqueta: 'Quejas', icono: 'alert', color: 'alerta' },
        { clave: 'PETICION', etiqueta: 'Peticiones', icono: 'doc', color: 'secondary' },
        { clave: 'FELICITACION', etiqueta: 'Felicitaciones', icono: 'chart', color: 'accent' },
      ] as const).map((e) => ({
        titulo: e.etiqueta,
        valor: formatearNumero(grupo[e.clave] ?? 0),
        subtexto: `${formatearPorcentaje(total > 0 ? ((grupo[e.clave] ?? 0) / total) * 100 : 0)} del total`,
        icono: e.icono,
        color: e.color,
      })),
      {
        titulo: 'Tiempo promedio de respuesta',
        valor: formatearDias(media),
        subtexto: `Mediana ${formatearDias(mediana)}`,
        icono: 'clock',
        color: 'secondary',
      },
      {
        titulo: 'Ámbito más frecuente',
        valor: titleCase(ambitoTop.categoria),
        subtexto: `${formatearNumero(ambitoTop.frecuencia)} registros`,
        icono: 'alert',
        color: 'alerta',
      },
      {
        titulo: 'Canal más utilizado',
        valor: titleCase(canalTop.categoria),
        subtexto: `${formatearNumero(canalTop.frecuencia)} radicaciones`,
        icono: 'mail',
        color: 'primary',
      },
      {
        titulo: 'Área con más PQRS',
        valor: titleCase(areaTop.categoria),
        subtexto: `${formatearNumero(areaTop.frecuencia)} registros`,
        icono: 'hosp',
        color: 'accent',
      },
    ];
  });

  protected readonly opcionesTipo = computed(() => {
    const v = variableDe(this.distribuciones(), 'tipo_pqrs_grupo');
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
    const regs = this.filtrados();
    if (!regs.length) {
      return 0;
    }
    return Math.min(100, (regs.reduce((s, r) => s + r.dias_respuesta, 0) / regs.length) * 10);
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