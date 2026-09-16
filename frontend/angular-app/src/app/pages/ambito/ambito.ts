import { Component, computed, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { FilterService } from '../../core/services/filter.service';
import { ChartContainer } from '../../shared/chart-container/chart-container';
import { InfoBox } from '../../shared/info-box/info-box';
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
  selector: 'app-ambito',
  imports: [ChartContainer, InfoBox, Loading],
  templateUrl: './ambito.html',
  styleUrl: './ambito.scss',
})
export class Ambito {
  private readonly api = inject(ApiService);
  protected readonly filtrosSvc = inject(FilterService);

  protected readonly distribuciones = signal<Distribuciones | null>(null);
  protected readonly cruceTipoAmbito = signal<Cruce | null>(null);
  protected readonly cruceAmbitoMes = signal<Cruce | null>(null);
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
      this.api.getCruces('tipo_pqrs_grupo,ambito'),
      this.api.getCruces('ambito,mes'),
      this.api.getTiempoRespuesta(),
    ]).subscribe({
      next: ([distribuciones, tipoAmbito, ambitoMes, tiempo]) => {
        this.distribuciones.set(distribuciones);
        this.cruceTipoAmbito.set(tipoAmbito.cruces[0] ?? null);
        this.cruceAmbitoMes.set(ambitoMes.cruces[0] ?? null);
        this.tiempo.set(tiempo);
        this.hayError.set(false);
      },
      error: () => this.hayError.set(true),
    });
  }

  protected readonly opcionesRanking = computed(() => {
    const v = variableDe(this.distribuciones(), 'ambito');
    if (!v) {
      return null;
    }
    const items = filtrarFrecuencias(v.frecuencias, 'ambitos', this.filtrosSvc.filtros());
    const convertidos = aItems(items);
    return convertidos.length > 0 ? opcionBarrasHorizontal(convertidos) : null;
  });

  protected readonly opcionesTipoAmbito = computed(() => {
    const cruce = this.cruceTipoAmbito();
    if (!cruce) {
      return null;
    }
    const filtrado = filtrarCruce(cruce, this.filtrosSvc.filtros());
    return filtrado.tabla.length > 0 ? opcionBarrasAgrupadas(filtrado) : null;
  });

  protected readonly opcionesAmbitoMes = computed(() => {
    const cruce = this.cruceAmbitoMes();
    if (!cruce) {
      return null;
    }
    const filtrado = filtrarCruce(cruce, this.filtrosSvc.filtros());
    const conDatos = filtrado.tabla.filter((f) => f.valores.some((v) => v.frecuencia > 0));
    return conDatos.length > 0 ? opcionHeatmap(filtrado) : null;
  });

  protected readonly opcionesMedianaAmbito = computed(() => {
    const items = this.tiempo()?.por_ambito;
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
