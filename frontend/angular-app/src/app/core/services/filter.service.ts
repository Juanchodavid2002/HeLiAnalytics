import { Injectable, signal } from '@angular/core';

export interface FiltrosActivos {
  tipos: string[];
  ambitos: string[];
  canales: string[];
  areas: string[];
  meses: number[];
}

const FILTROS_VACIOS: FiltrosActivos = {
  tipos: [],
  ambitos: [],
  canales: [],
  areas: [],
  meses: [],
};

@Injectable({ providedIn: 'root' })
export class FilterService {
  filtros = signal<FiltrosActivos>({ ...FILTROS_VACIOS });

  actualizarFiltro(filtros: Partial<FiltrosActivos>): void {
    this.filtros.update((actuales) => ({ ...actuales, ...filtros }));
  }

  alternarCategoria(clave: keyof FiltrosActivos, valor: string | number): void {
    const actuales = this.filtros()[clave] as (string | number)[];
    const actualizados = actuales.includes(valor)
      ? actuales.filter((v) => v !== valor)
      : [...actuales, valor];
    this.actualizarFiltro({ [clave]: actualizados } as Partial<FiltrosActivos>);
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
      actuales.meses.length > 0
    );
  }
}