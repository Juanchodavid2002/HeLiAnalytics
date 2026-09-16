import { Component, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

import { FilterService } from '../../core/services/filter.service';
import { VariableFiltro } from '../../core/utils/filtrar';

interface ParamClic {
  name?: string;
  seriesName?: string;
  dataIndex?: number;
  value?: number | number[] | string | string[];
}

@Component({
  selector: 'app-chart-container',
  imports: [NgxEchartsDirective],
  templateUrl: './chart-container.html',
  styleUrl: './chart-container.scss',
})
export class ChartContainer {
  private readonly filterSvc = inject(FilterService);

  readonly titulo = input('');
  readonly subtitulo = input('');
  readonly opciones = input<EChartsOption | null>(null);
  readonly altura = input('250px');
  readonly cargando = input(false);
  readonly clicFiltro = input<VariableFiltro | null>(null);

  protected alClic(params: unknown): void {
    const clave = this.clicFiltro();
    if (!clave) {
      return;
    }
    const p = params as ParamClic;
    const categoria = p?.name;
    if (!categoria) {
      return;
    }
    this.filterSvc.alternarCategoria(clave, String(categoria));
  }
}