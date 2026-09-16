import { Component, computed, inject, signal } from '@angular/core';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { FilterService } from '../../core/services/filter.service';
import { ChartContainer } from '../../shared/chart-container/chart-container';
import { InfoBox } from '../../shared/info-box/info-box';
import { Loading } from '../../shared/loading/loading';
import { Cruce, Distribuciones } from '../../core/models/distribucion.model';
import {
  aItems,
  filtrarCruce,
  filtrarFrecuencias,
  variableDe,
} from '../../core/utils/filtrar';
import { opcionBarrasHorizontal, opcionDonut } from '../../core/utils/charts';

type Dimension = 'aseguradora' | 'regional' | 'tipo_usuario' | 'vencimiento';

@Component({
  selector: 'app-red',
  imports: [ChartContainer, InfoBox, Loading],
  templateUrl: './red.html',
  styleUrl: './red.scss',
})
export class RedCobertura {
  private readonly api = inject(ApiService);
  protected readonly filtrosSvc = inject(FilterService);

  protected readonly distribuciones = signal<Distribuciones | null>(null);
  protected readonly cruceAseguradoraTipo = signal<Cruce | null>(null);
  protected readonly hayError = signal(false);
  protected readonly dimension = signal<Dimension>('aseguradora');

  protected readonly cargando = computed(
    () => this.distribuciones() === null && !this.hayError(),
  );

  protected readonly dimensiones: { clave: Dimension; etiqueta: string; tipo: 'barras' | 'donut' }[] = [
    { clave: 'aseguradora', etiqueta: 'Aseguradora', tipo: 'barras' },
    { clave: 'regional', etiqueta: 'Regional', tipo: 'barras' },
    { clave: 'tipo_usuario', etiqueta: 'Tipo de usuario', tipo: 'donut' },
    { clave: 'vencimiento', etiqueta: 'Gestión a tiempo', tipo: 'donut' },
  ];

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
      this.api.getCruces('aseguradora,tipo_pqrs_grupo'),
    ]).subscribe({
      next: ([distribuciones, asegTipo]) => {
        this.distribuciones.set(distribuciones);
        this.cruceAseguradoraTipo.set(asegTipo.cruces[0] ?? null);
        this.hayError.set(false);
      },
      error: () => this.hayError.set(true),
    });
  }

  protected readonly opcionesDimension = computed(() => {
    const dim = this.dimension();
    const v = variableDe(this.distribuciones(), dim);
    if (!v) {
      return null;
    }
    const items = aItems(v.frecuencias);
    if (!items.length) {
      return null;
    }
    const cfg = this.dimensiones.find((d) => d.clave === dim);
    if (cfg?.tipo === 'donut') {
      return opcionDonut(items, dim);
    }
    return opcionBarrasHorizontal(items.slice(0, 12));
  });

  protected readonly opcionesAsegTipo = computed(() => {
    const cruce = this.cruceAseguradoraTipo();
    if (!cruce) {
      return null;
    }
    const filtrado = filtrarCruce(cruce, this.filtrosSvc.filtros());
    const top = filtrado.tabla.slice(0, 8);
    const conDatos = top.filter((f) => f.valores.some((v) => v.frecuencia > 0));
    return conDatos.length > 0 ? opcionDonut(
      conDatos.map((f) => ({
        categoria: f.x,
        frecuencia: f.valores.reduce((s, v) => s + v.frecuencia, 0),
        porcentaje: 0,
      })),
      'Top aseguradoras',
    ) : null;
  });
}
