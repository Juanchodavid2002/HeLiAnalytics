import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-info-box',
  imports: [],
  templateUrl: './info-box.html',
  styleUrl: './info-box.scss',
})
export class InfoBox {
  readonly contenido = input('');
  readonly etiqueta = input('¿Qué significa?');

  protected readonly abierto = signal(false);

  protected alternar(): void {
    this.abierto.set(!this.abierto());
  }
}