import { Component, inject, signal } from '@angular/core';

import { ApiService } from '../../core/services/api.service';
import { FilterService, FiltrosActivos } from '../../core/services/filter.service';
import { Filtros } from '../../core/models/insight.model';
import { formatearNumero, nombreMes } from '../../core/utils/formatters';

interface Opcion {
  valor: string | number;
  etiqueta: string;
}

type ClaveFiltro = keyof FiltrosActivos;

interface ConfigFiltro {
  clave: ClaveFiltro;
  etiqueta: string;
}

const CONFIG_FILTROS: ConfigFiltro[] = [
  { clave: 'meses', etiqueta: 'Periodo' },
  { clave: 'areas', etiqueta: 'Área de solicitud' },
  { clave: 'tipos', etiqueta: 'Tipo de PQRS' },
  { clave: 'ambitos', etiqueta: 'Ámbito' },
  { clave: 'canales', etiqueta: 'Canal' },
];

@Component({
  selector: 'app-filter-bar',
  imports: [],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
})
export class FilterBar {
  private readonly api = inject(ApiService);
  readonly filterSvc = inject(FilterService);

  readonly opciones = signal<Filtros | null>(null);
  readonly desplegado = signal<ClaveFiltro | null>(null);
  readonly configs = CONFIG_FILTROS;

  constructor() {
    this.api.getFiltros().subscribe({
      next: (f) => this.opciones.set(f),
      error: () => this.opciones.set(null),
    });
  }

  opcionesDe(clave: ClaveFiltro): Opcion[] {
    const f = this.opciones();
    if (!f) {
      return [];
    }
    switch (clave) {
      case 'meses':
        return f.meses.map((m) => {
          const num = Number(Object.keys(m)[0]);
          return { valor: num, etiqueta: nombreMes(num) };
        });
      case 'areas':
        return f.areas.map((a) => ({ valor: a, etiqueta: a }));
      case 'ambitos':
        return f.ambitos.map((a) => ({ valor: a, etiqueta: a }));
      case 'tipos':
        return f.tipos.map((t) => ({ valor: t, etiqueta: t }));
      case 'canales':
        return f.canales.map((c) => ({ valor: c, etiqueta: c }));
      case 'clusters':
        return f.clusters.map((c) => ({ valor: c.id, etiqueta: `${c.letra} · ${c.nombre} (${formatearNumero(c.cantidad)})` }));
    }
  }

  estaSeleccionado(clave: ClaveFiltro, valor: string | number): boolean {
    const seleccion: (string | number)[] = this.filterSvc.filtros()[clave] as (string | number)[];
    return seleccion.includes(valor);
  }

  alternarSeleccion(clave: ClaveFiltro, valor: string | number): void {
    const actuales = this.filterSvc.filtros()[clave] as (string | number)[];
    const actualizados = actuales.includes(valor)
      ? actuales.filter((v) => v !== valor)
      : [...actuales, valor];
    this.filterSvc.actualizarFiltro({ [clave]: actualizados } as Partial<FiltrosActivos>);
  }

  alternarDesplegado(clave: ClaveFiltro): void {
    this.desplegado.set(this.desplegado() === clave ? null : clave);
  }

  cerrar(): void {
    this.desplegado.set(null);
  }

  filtrarTotalActivos(): number {
    const actuales = this.filterSvc.filtros();
    return (
      actuales.tipos.length +
      actuales.ambitos.length +
      actuales.canales.length +
      actuales.areas.length +
      actuales.meses.length
    );
  }

  contarSeleccionados(clave: ClaveFiltro): number {
    return (this.filterSvc.filtros()[clave] as unknown[]).length;
  }
}