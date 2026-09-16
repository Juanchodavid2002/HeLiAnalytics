import { Component, computed, inject, signal } from '@angular/core';

import { ApiService } from '../../core/services/api.service';
import { Insights, TipoInsight } from '../../core/models/insight.model';
import { InfoBox } from '../../shared/info-box/info-box';
import { Loading } from '../../shared/loading/loading';
import { formatearNumero, formatearFecha } from '../../core/utils/formatters';

const COLORES_TIPO: Record<TipoInsight, string> = {
  hallazgo: 'bg-secondary/10 text-secondary',
  prioridad: 'bg-error/10 text-error',
  oportunidad: 'bg-accent/10 text-accent',
  tendencia: 'bg-alerta/10 text-alerta',
};

const ETIQUETAS_TIPO: Record<TipoInsight, string> = {
  hallazgo: 'Hallazgo',
  prioridad: 'Prioridad',
  oportunidad: 'Oportunidad',
  tendencia: 'Tendencia',
};

@Component({
  selector: 'app-insights',
  imports: [InfoBox, Loading],
  templateUrl: './insights.html',
  styleUrl: './insights.scss',
})
export class PaginaInsights {
  private readonly api = inject(ApiService);

  protected readonly insights = signal<Insights | null>(null);
  protected readonly hayError = signal(false);

  protected readonly cargando = computed(() => this.insights() === null && !this.hayError());

  constructor() {
    this.api.getInsights().subscribe({
      next: (i) => this.insights.set(i),
      error: () => this.hayError.set(true),
    });
  }

  protected reintentar(): void {
    this.insights.set(null);
    this.hayError.set(false);
    this.api.getInsights().subscribe({
      next: (i) => this.insights.set(i),
      error: () => this.hayError.set(true),
    });
  }

  protected readonly totalAnalizados = computed(() => formatearNumero(this.insights()?.total_registros_analizados));
  protected readonly fechaGeneracion = computed(() => formatearFecha(this.insights()?.fecha_generacion));
  protected readonly periodo = computed(() => this.insights()?.periodo ?? 'II semestre 2025');

  protected claseTipo(tipo: TipoInsight): string {
    return COLORES_TIPO[tipo] ?? COLORES_TIPO.hallazgo;
  }

  protected etiquetaTipo(tipo: TipoInsight): string {
    return ETIQUETAS_TIPO[tipo] ?? tipo;
  }
}