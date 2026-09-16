import { Component, computed, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { FilterService } from '../../core/services/filter.service';
import { ChartContainer } from '../../shared/chart-container/chart-container';
import { Loading } from '../../shared/loading/loading';
import { Cruce, Distribuciones, TiempoRespuesta } from '../../core/models/distribucion.model';
import {
  aItems,
  filtrarCruce,
  filtrarFrecuencias,
  variableDe,
} from '../../core/utils/filtrar';
import {
  opcionBarrasAgrupadas,
  opcionBarrasHorizontal,
  opcionBarrasMediana,
  opcionHeatmap,
} from '../../core/utils/charts';

@Component({
  selector: 'app-areas',
  imports: [ChartContainer, Loading],
  templateUrl: './areas.html',
  styleUrl: './areas.scss',
})
export class Areas {
  private readonly api = inject(ApiService);
  protected readonly filtrosSvc = inject(FilterService);

  protected readonly distribuciones = signal<Distribuciones | null>(null);
  protected readonly cruceAreaTipo = signal<Cruce | null>(null);
  protected readonly cruceAreaAmbito = signal<Cruce | null>(null);
  protected readonly tiempo = signal<TiempoRespuesta | null>(null);
  protected readonly hayError = signal(false);

  protected readonly cargando = computed(
    () => this.distribuciones() === null && !this.hayError(),
  );

  constructor() {
    this.cargarDatos();
  }

  protected reintentar(): void {
    this.hayError.set(false);
    this.cargarDatos();
  }

  private cargarDatos(): void {
    combineLatest([
      this.api.getDistribuciones(),
      this.api.getCruces('area_solicitud,tipo_pqrs_grupo'),
      this.api.getCruces('area_solicitud,ambito'),
      this.api.getTiempoRespuesta(),
    ]).subscribe({
      next: ([distribuciones, areaTipo, areaAmbito, tiempo]) => {
        this.distribuciones.set(distribuciones);
        this.cruceAreaTipo.set(areaTipo.cruces[0] ?? null);
        this.cruceAreaAmbito.set(areaAmbito.cruces[0] ?? null);
        this.tiempo.set(tiempo);
        this.hayError.set(false);
      },
      error: () => this.hayError.set(true),
    });
  }

  protected readonly opcionesRanking = computed(() => {
    const v = variableDe(this.distribuciones(), 'area_solicitud');
    if (!v) {
      return null;
    }
    const items = filtrarFrecuencias(v.frecuencias, 'areas', this.filtrosSvc.filtros());
    const convertidos = aItems(items);
    return convertidos.length > 0 ? opcionBarrasHorizontal(convertidos) : null;
  });

  protected readonly opcionesAreaTipo = computed(() => {
    const cruce = this.cruceAreaTipo();
    if (!cruce) {
      return null;
    }
    const filtrado = filtrarCruce(cruce, this.filtrosSvc.filtros());
    return filtrado.tabla.length > 0 ? opcionBarrasAgrupadas(filtrado) : null;
  });

  protected readonly opcionesAreaAmbito = computed(() => {
    const cruce = this.cruceAreaAmbito();
    if (!cruce) {
      return null;
    }
    const filtrado = filtrarCruce(cruce, this.filtrosSvc.filtros());
    const conDatos = filtrado.tabla.filter((f) => f.valores.some((v) => v.frecuencia > 0));
    return conDatos.length > 0 ? opcionHeatmap(filtrado) : null;
  });

  protected readonly opcionesMedianaArea = computed(() => {
    const items = this.tiempo()?.por_area;
    if (!items?.length) {
      return null;
    }
    return opcionBarrasMediana(items.map((i) => ({
      categoria: i.categoria,
      mediana: i.mediana,
      total: i.total,
    })));
  });
}
