import { Component, computed, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { FilterService } from '../../core/services/filter.service';
import { ChartContainer } from '../../shared/chart-container/chart-container';
import { Loading } from '../../shared/loading/loading';
import {
  Cruce,
  Distribuciones,
  Temporal,
  TiempoRespuesta,
} from '../../core/models/distribucion.model';
import {
  aItems,
  filtrarCruce,
  filtrarFrecuencias,
  filtrarMeses,
  variableDe,
} from '../../core/utils/filtrar';
import {
  opcionBarrasAgrupadas,
  opcionBarrasHorizontal,
  opcionBarrasTiempo,
  opcionHeatmap,
  opcionLineasPorMes,
} from '../../core/utils/charts';
import { formatearDias, formatearNumero, formatearPorcentaje } from '../../core/utils/formatters';

@Component({
  selector: 'app-causas',
  imports: [ChartContainer, Loading],
  templateUrl: './causas.html',
  styleUrl: './causas.scss',
})
export class Causas {
  private readonly api = inject(ApiService);
  protected readonly filtrosSvc = inject(FilterService);

  protected readonly distribuciones = signal<Distribuciones | null>(null);
  protected readonly cruceTipoCausa = signal<Cruce | null>(null);
  protected readonly cruceCausaPrograma = signal<Cruce | null>(null);
  protected readonly tiempo = signal<TiempoRespuesta | null>(null);
  protected readonly temporal = signal<Temporal | null>(null);
  protected readonly hayError = signal(false);

  protected readonly cargando = computed(() => this.distribuciones() === null && !this.hayError());

  constructor() {
    this.cargarDatos();
  }

  protected reintentar(): void {
    this.distribuciones.set(null);
    this.hayError.set(false);
    this.cargarDatos();
  }

  private cargarDatos(): void {
    combineLatest([
      this.api.getDistribuciones(),
      this.api.getCruces('tipo_pqrs_grupo,causa'),
      this.api.getCruces('causa,programa'),
      this.api.getTiempoRespuesta(),
      this.api.getTemporal(),
    ]).subscribe({
      next: ([distribuciones, tipoCausa, causaPrograma, tiempo, temporal]) => {
        this.distribuciones.set(distribuciones);
        this.cruceTipoCausa.set(tipoCausa.cruces[0] ?? null);
        this.cruceCausaPrograma.set(causaPrograma.cruces[0] ?? null);
        this.tiempo.set(tiempo);
        this.temporal.set(temporal);
        this.hayError.set(false);
      },
      error: () => this.hayError.set(true),
    });
  }

  protected readonly indicadores = computed(() => {
    const t = this.tiempo();
    if (!t) {
      return null;
    }
    const total = t.distribucion_bins.reduce((acc, b) => acc + b.frecuencia, 0);
    return [
      {
        titulo: 'Media de respuesta',
        valor: formatearDias(t.media),
        detalle: `Desviación ${formatearDias(t.desviacion)}`,
      },
      {
        titulo: 'Mediana de respuesta',
        valor: formatearDias(t.mediana),
        detalle: `P25 ${formatearDias(t.p25)} · P75 ${formatearDias(t.p75)}`,
      },
      {
        titulo: 'Respondidas en ≤ 30 días',
        valor: `${formatearNumero(t.n_menor_igual_30)} (${formatearPorcentaje(t.pct_menor_igual_30)})`,
        detalle: 'Cumplimiento Circular 008/2018',
      },
      {
        titulo: 'Rango de respuesta',
        valor: `${formatearDias(t.min)} — ${formatearDias(t.max)}`,
        detalle: 'Mínimo — máximo',
      },
      {
        titulo: 'Total analizado',
        valor: formatearNumero(total),
        detalle: 'Registros con dato de respuesta',
      },
    ];
  });

  protected readonly opcionesRanking = computed(() => {
    const v = variableDe(this.distribuciones(), 'causa');
    if (!v) {
      return null;
    }
    const items = filtrarFrecuencias(v.frecuencias, 'causas', this.filtrosSvc.filtros());
    const convertidos = aItems(items);
    return convertidos.length > 0 ? opcionBarrasHorizontal(convertidos) : null;
  });

  protected readonly opcionesTipoCausa = computed(() => {
    const cruce = this.cruceTipoCausa();
    if (!cruce) {
      return null;
    }
    const filtrado = filtrarCruce(cruce, this.filtrosSvc.filtros());
    return filtrado.tabla.length > 0 ? opcionBarrasAgrupadas(filtrado) : null;
  });

  protected readonly opcionesCausaServicio = computed(() => {
    const cruce = this.cruceCausaPrograma();
    if (!cruce) {
      return null;
    }
    const filtrado = filtrarCruce(cruce, this.filtrosSvc.filtros());
    const conDatos = filtrado.tabla.filter((fila) => fila.valores.some((v) => v.frecuencia > 0));
    return conDatos.length > 0 ? opcionHeatmap(filtrado) : null;
  });

  protected readonly opcionesTiempo = computed(() => {
    const t = this.tiempo();
    if (!t) {
      return null;
    }
    return opcionBarrasTiempo(t.distribucion_bins);
  });

  protected readonly opcionesCausaMes = computed(() => {
    const t = this.temporal();
    if (!t) {
      return null;
    }
    const meses = filtrarMeses(t.por_mes, this.filtrosSvc.filtros());
    return meses.length > 0 ? opcionLineasPorMes(meses) : null;
  });
}