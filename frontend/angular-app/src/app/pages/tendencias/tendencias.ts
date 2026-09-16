import { Component, computed, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { FilterService } from '../../core/services/filter.service';
import { ChartContainer } from '../../shared/chart-container/chart-container';
import { Loading } from '../../shared/loading/loading';
import { Cruce } from '../../core/models/distribucion.model';
import { filtrarCruce } from '../../core/utils/filtrar';
import { opcionHeatmap } from '../../core/utils/charts';

@Component({
  selector: 'app-tendencias',
  imports: [ChartContainer, Loading],
  templateUrl: './tendencias.html',
  styleUrl: './tendencias.scss',
})
export class Tendencias {
  private readonly api = inject(ApiService);
  protected readonly filtrosSvc = inject(FilterService);

  protected readonly cruceTipoMes = signal<Cruce | null>(null);
  protected readonly cruceAmbitoMes = signal<Cruce | null>(null);
  protected readonly cruceAreaCanal = signal<Cruce | null>(null);
  protected readonly hayError = signal(false);

  protected readonly cargando = computed(
    () => this.cruceTipoMes() === null && !this.hayError(),
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
      this.api.getCruces('tipo_pqrs_grupo,mes'),
      this.api.getCruces('ambito,mes'),
      this.api.getCruces('area_solicitud,canal'),
    ]).subscribe({
      next: ([tipoMes, ambitoMes, areaCanal]) => {
        this.cruceTipoMes.set(tipoMes.cruces[0] ?? null);
        this.cruceAmbitoMes.set(ambitoMes.cruces[0] ?? null);
        this.cruceAreaCanal.set(areaCanal.cruces[0] ?? null);
        this.hayError.set(false);
      },
      error: () => this.hayError.set(true),
    });
  }

  private mapaCruce(cruce: Cruce | null) {
    if (!cruce) {
      return null;
    }
    const filtrado = filtrarCruce(cruce, this.filtrosSvc.filtros());
    const conDatos = filtrado.tabla.filter((f) => f.valores.some((v) => v.frecuencia > 0));
    return conDatos.length > 0 ? opcionHeatmap(filtrado) : null;
  }

  protected readonly opcionesTipoMes = computed(() => this.mapaCruce(this.cruceTipoMes()));
  protected readonly opcionesAmbitoMes = computed(() => this.mapaCruce(this.cruceAmbitoMes()));
  protected readonly opcionesAreaCanal = computed(() => this.mapaCruce(this.cruceAreaCanal()));
}
