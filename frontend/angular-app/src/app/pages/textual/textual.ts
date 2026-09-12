import { Component, computed, inject, signal } from '@angular/core';

import { ApiService } from '../../core/services/api.service';
import { Textual } from '../../core/models/insight.model';
import { Loading } from '../../shared/loading/loading';
import { formatearNumero } from '../../core/utils/formatters';

@Component({
  selector: 'app-textual',
  imports: [Loading],
  templateUrl: './textual.html',
  styleUrl: './textual.scss',
})
export class PaginaTextual {
  private readonly api = inject(ApiService);

  protected readonly textual = signal<Textual | null>(null);
  protected readonly hayError = signal(false);

  protected readonly cargando = computed(() => this.textual() === null && !this.hayError());

  constructor() {
    this.api.getTextual().subscribe({
      next: (t) => this.textual.set(t),
      error: () => this.hayError.set(true),
    });
  }

  protected reintentar(): void {
    this.textual.set(null);
    this.hayError.set(false);
    this.api.getTextual().subscribe({
      next: (t) => this.textual.set(t),
      error: () => this.hayError.set(true),
    });
  }

  protected readonly totalPalabras = computed(() => formatearNumero(this.textual()?.top_palabras?.length ?? 0));
}