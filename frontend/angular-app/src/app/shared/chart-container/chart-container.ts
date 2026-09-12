import { Component, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-chart-container',
  imports: [NgxEchartsDirective],
  templateUrl: './chart-container.html',
  styleUrl: './chart-container.scss',
})
export class ChartContainer {
  readonly titulo = input('');
  readonly subtitulo = input('');
  readonly opciones = input<EChartsOption | null>(null);
  readonly altura = input('250px');
  readonly cargando = input(false);
}