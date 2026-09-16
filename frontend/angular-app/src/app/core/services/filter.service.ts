import { Injectable, signal } from '@angular/core';

export interface FiltrosActivos {
  tipos: string[];
  ambitos: string[];
  canales: string[];
  areas: string[];
  meses: number[];
  clusters: number[];
}

const FILTROS_VACIOS: FiltrosActivos = {
  tipos: [],
  ambitos: [],
  canales: [],
  areas: [],
  meses: [],
  clusters: [],
};

@Injectable({ providedIn: 'root' })
export class FilterService {
  filtros = signal<FiltrosActivos>({ ...FILTROS_VACIOS });

  actualizarFiltro(filtros: Partial<FiltrosActivos>): void {
    this.filtros.update((actuales) => ({ ...actuales, ...filtros }));
  }

  limpiarFiltros(): void {
    this.filtros.set({ ...FILTROS_VACIOS });
  }

  hayFiltrosActivos(): boolean {
    const actuales = this.filtros();
    return (
      actuales.tipos.length > 0 ||
      actuales.ambitos.length > 0 ||
      actuales.canales.length > 0 ||
      actuales.areas.length > 0 ||
      actuales.meses.length > 0 ||
      actuales.clusters.length > 0
    );
  }
}