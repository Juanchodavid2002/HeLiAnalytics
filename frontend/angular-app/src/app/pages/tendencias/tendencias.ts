import { Component, computed, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { FilterService } from '../../core/services/filter.service';
import { ChartContainer } from '../../shared/chart-container/chart-container';
import { Loading } from '../../shared/loading/loading';
import { Cruce, Distribuciones, Temporal } from '../../core/models/distribucion.model';
import {
  aItems,
  filtrarCruce,
  filtrarFrecuencias,
  filtrarMeses,
  variableDe,
} from '../../core/utils/filtrar';
import {
  opcionBarrasVertical,
  opcionDonut,
  opcionHeatmap,
  opcionLineasPorMes,
  opcionLineasPorTipo,
} from '../../core/utils/charts';

@Component({
  selector: 'app-tendencias',
  imports: [ChartContainer, Loading],
  templateUrl: './tendencias.html',
  styleUrl: './tendencias.scss',
})
export class Tendencias {
  private readonly api = inject(ApiService);
  protected readonly filtrosSvc = inject(FilterService);

  protected readonly temporal = signal<Temporal | null>(null);
  protected readonly distribuciones = signal<Distribuciones | null>(null);
  protected readonly cruceCausaCanal = signal<Cruce | null>(null);
  protected readonly hayError = signal(false);

  protected readonly cargando = computed(() => this.temporal() === null && !this.hayError());

  constructor() {
    this.cargarDatos();
  }

  protected reintentar(): void {
    this.temporal.set(null);
    this.hayError.set(false);
    this.cargarDatos();
  }

  private cargarDatos(): void {
    combineLatest([
      this.api.getTemporal(),
      this.api.getDistribuciones(),
      this.api.getCruces('causa,canal'),
    ]).subscribe({
      next: ([temporal, distribuciones, cruces]) => {
        this.temporal.set(temporal);
        this.distribuciones.set(distribuciones);
        this.cruceCausaCanal.set(cruces.cruces[0] ?? null);
        this.hayError.set(false);
      },
      error: () => this.hayError.set(true),
    });
  }

  protected readonly opcionesPorMes = computed(() => {
    const t = this.temporal();
    if (!t) {
      return null;
    }
    const meses = filtrarMeses(t.por_mes, this.filtrosSvc.filtros());
    return meses.length > 0 ? opcionLineasPorMes(meses) : null;
  });

  protected readonly opcionesPorTipo = computed(() => {
    const t = this.temporal();
    if (!t) {
      return null;
    }
    const meses = filtrarMeses(t.por_mes_tipo, this.filtrosSvc.filtros());
    return meses.length > 0 ? opcionLineasPorTipo(meses) : null;
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

  protected readonly opcionesCanalBarras = computed(() => {
    const v = variableDe(this.distribuciones(), 'canal');
    if (!v) {
      return null;
    }
    const items = filtrarFrecuencias(v.frecuencias, 'canales', this.filtrosSvc.filtros());
    const convertidos = aItems(items);
    return convertidos.length > 0 ? opcionBarrasVertical(convertidos) : null;
  });

  protected readonly opcionesCausaCanal = computed(() => {
    const cruce = this.cruceCausaCanal();
    if (!cruce) {
      return null;
    }
    const filtrado = filtrarCruce(cruce, this.filtrosSvc.filtros());
    const conDatos = filtrado.tabla.filter((fila) => fila.valores.some((v) => v.frecuencia > 0));
    return conDatos.length > 0 ? opcionHeatmap(filtrado) : null;
  });
}