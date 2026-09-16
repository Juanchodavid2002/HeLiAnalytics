import { Component, computed, inject, signal } from '@angular/core';

import { ApiService } from '../../core/services/api.service';
import { FilterService } from '../../core/services/filter.service';
import { ChartContainer } from '../../shared/chart-container/chart-container';
import { Loading } from '../../shared/loading/loading';
import { Clusters, Cluster, ClusterVarPerfil } from '../../core/models/cluster.model';
import { formatearDias, formatearNumero, formatearPorcentaje, titleCase } from '../../core/utils/formatters';
import { opcionBarrasPorcentaje } from '../../core/utils/charts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-segmentacion',
  imports: [ChartContainer, Loading],
  templateUrl: './segmentacion.html',
  styleUrl: './segmentacion.scss',
})
export class Segmentacion {
  private readonly api = inject(ApiService);
  protected readonly filtrosSvc = inject(FilterService);

  protected readonly formatearNumero = formatearNumero;
  protected readonly formatearPorcentaje = formatearPorcentaje;
  protected readonly formatearDias = formatearDias;
  protected readonly titleCase = titleCase;

  protected readonly clusters = signal<Clusters | null>(null);
  protected readonly seleccionado = signal<number | null>(null);
  protected readonly hayError = signal(false);

  protected readonly cargando = computed(() => this.clusters() === null && !this.hayError());

  constructor() {
    this.api.getClusters().subscribe({
      next: (c) => {
        this.clusters.set(c);
        this.hayError.set(false);
      },
      error: () => this.hayError.set(true),
    });
  }

  protected reintentar(): void {
    this.clusters.set(null);
    this.hayError.set(false);
    this.api.getClusters().subscribe({
      next: (c) => {
        this.clusters.set(c);
        this.hayError.set(false);
      },
      error: () => this.hayError.set(true),
    });
  }

  protected readonly metadatos = computed(() => {
    const c = this.clusters();
    if (!c) {
      return null;
    }
    return [
      { etiqueta: 'Algoritmo', valor: c.algoritmo },
      { etiqueta: 'Número de segmentos', valor: formatearNumero(c.num_clusters) },
      { etiqueta: 'Variables categóricas', valor: formatearNumero(c.variables_categoricas?.length ?? 0) },
      { etiqueta: 'Costo total', valor: formatearNumero(Math.round(c.metricas?.costo_total ?? 0)) },
    ];
  });

  protected readonly opcionesVistaGeneral = computed<EChartsOption | null>(() => {
    const c = this.clusters();
    if (!c) {
      return null;
    }
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; percent: number };
          return `<strong>Segmento ${p.name}</strong><br/>${formatearNumero(p.value)} registros (${p.percent.toLocaleString('es-CO', { maximumFractionDigits: 1 })}%)`;
        },
      },
      legend: { bottom: 0, icon: 'circle', textStyle: { fontSize: 11, color: '#64748B' } },
      series: [
        {
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['50%', '45%'],
          itemStyle: { borderColor: '#ffffff', borderWidth: 2 },
          label: {
            color: '#1E293B',
            fontSize: 12,
            formatter: (p: unknown) => `Seg. ${(p as { name: string }).name}\n${(p as { percent: number }).percent}%`,
          },
          data: c.clusters.map((cl) => ({
            name: cl.letra,
            value: cl.cantidad,
          })),
        },
      ],
    };
  });

  protected readonly clusterSeleccionado = computed<Cluster | null>(() => {
    const c = this.clusters();
    if (!c) {
      return null;
    }
    return c.clusters.find((cl) => cl.id === this.seleccionado()) ?? null;
  });

  protected readonly variablesPerfil = computed(() => {
    const cl = this.clusterSeleccionado();
    if (!cl) {
      return [];
    }
    const variables: { nombre: string; etiqueta: string; perfil: ClusterVarPerfil }[] = [];
    const claves: [string, string][] = [
      ['tipo_pqrs_grupo', 'Tipo de PQRS'],
      ['ambito', 'Ámbito'],
      ['canal', 'Canal'],
      ['area_solicitud', 'Área de solicitud'],
    ];
    for (const [clave, etiqueta] of claves) {
      const perfil = cl.perfil[clave as keyof Cluster['perfil']] as ClusterVarPerfil | undefined;
      if (perfil && perfil.moda) {
        variables.push({ nombre: clave, etiqueta, perfil });
      }
    }
    return variables;
  });

  protected readonly opcionesPerfilVariable = (nombre: string, perfil: ClusterVarPerfil): EChartsOption | null => {
    void nombre;
    if (!perfil || !perfil.top || perfil.top.length === 0) {
      return null;
    }
    return opcionBarrasPorcentaje(perfil.top);
  };

  seleccionar(id: number): void {
    this.seleccionado.set(this.seleccionado() === id ? null : id);
  }
}