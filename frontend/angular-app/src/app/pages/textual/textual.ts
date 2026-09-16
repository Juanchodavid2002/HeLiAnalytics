import { Component, computed, inject, signal } from '@angular/core';

import { ApiService } from '../../core/services/api.service';
import { FilterService } from '../../core/services/filter.service';
import { ChartContainer } from '../../shared/chart-container/chart-container';
import { InfoBox } from '../../shared/info-box/info-box';
import { Loading } from '../../shared/loading/loading';
import { Textual, RegistroTextual, PalabraFrecuencia } from '../../core/models/insight.model';
import { opcionBarrasHorizontal } from '../../core/utils/charts';
import { formatearNumero } from '../../core/utils/formatters';

type VistaPalabras = 'global' | 'tipo' | 'ambito' | 'area_solicitud';

@Component({
  selector: 'app-textual',
  imports: [ChartContainer, InfoBox, Loading],
  templateUrl: './textual.html',
  styleUrl: './textual.scss',
})
export class PaginaTextual {
  private readonly api = inject(ApiService);
  protected readonly filtrosSvc = inject(FilterService);

  protected readonly textual = signal<Textual | null>(null);
  protected readonly hayError = signal(false);
  protected readonly vistaSeleccionada = signal<VistaPalabras>('global');
  protected readonly busqueda = signal('');
  protected readonly claveDim = signal<string>('');

  protected readonly cargando = computed(
    () => this.textual() === null && !this.hayError(),
  );

  protected readonly dimKeys: { clave: VistaPalabras; etiqueta: string }[] = [
    { clave: 'global', etiqueta: 'Global' },
    { clave: 'tipo', etiqueta: 'Por tipo' },
    { clave: 'ambito', etiqueta: 'Por ámbito' },
    { clave: 'area_solicitud', etiqueta: 'Por área' },
  ];

  constructor() {
    this.api.getTextual().subscribe({
      next: (t) => this.textual.set(t),
      error: () => this.hayError.set(true),
    });
  }

  protected reintentar(): void {
    this.hayError.set(false);
    this.textual.set(null);
    this.api.getTextual().subscribe({
      next: (t) => this.textual.set(t),
      error: () => this.hayError.set(true),
    });
  }

  protected cambiarVista(clave: VistaPalabras): void {
    this.vistaSeleccionada.set(clave);
    if (clave !== 'global') {
      const vals = this.textual()?.top_palabras?.[clave];
      const keys = vals ? Object.keys(vals) : [];
      this.claveDim.set(keys[0] ?? '');
    } else {
      this.claveDim.set('');
    }
  }

  protected opcionesTopPalabras = computed(() => {
    const t = this.textual();
    if (!t?.top_palabras) {
      return null;
    }
    const vista = this.vistaSeleccionada();
    let palabras: PalabraFrecuencia[];
    if (vista === 'global') {
      palabras = t.top_palabras.global;
    } else {
      const mapa = t.top_palabras[vista] as Record<string, PalabraFrecuencia[]>;
      palabras = mapa?.[this.claveDim()] ?? [];
    }
    if (!palabras?.length) {
      return null;
    }
    const items = palabras.map((p) => ({
      categoria: p.palabra,
      frecuencia: p.frecuencia,
      porcentaje: 0,
    }));
    return opcionBarrasHorizontal(items);
  });

  protected dimOpciones = computed(() => {
    const t = this.textual();
    const vista = this.vistaSeleccionada();
    if (vista === 'global' || !t?.top_palabras) {
      return [];
    }
    const mapa = t.top_palabras[vista] as Record<string, PalabraFrecuencia[]>;
    return Object.keys(mapa).sort();
  });

  protected registrosFiltrados = computed(() => {
    const t = this.textual();
    if (!t?.registros) {
      return [];
    }
    const f = this.filtrosSvc.filtros();
    const busq = this.busqueda().trim().toLowerCase();
    return t.registros.filter((r) =>
      (f.tipos.length === 0 || f.tipos.includes(r.tipo_pqrs_grupo ?? '')) &&
      (f.ambitos.length === 0 || f.ambitos.includes(r.ambito)) &&
      (f.canales.length === 0 || f.canales.includes(r.canal)) &&
      (f.areas.length === 0 || f.areas.includes(r.area_solicitud)) &&
      (f.meses.length === 0 || f.meses.includes(r.mes_num)) &&
      (busq === '' || r.keywords.some((k) => k.toLowerCase().includes(busq)) || r.texto_preview.toLowerCase().includes(busq))
    );
  });

  protected totalRegistros = computed(() => formatearNumero(this.registrosFiltrados().length));
  protected totalGlobal = computed(() => formatearNumero(this.textual()?.registros?.length ?? 0));
}
