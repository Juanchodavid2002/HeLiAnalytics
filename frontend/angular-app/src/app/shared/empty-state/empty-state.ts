import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly mensaje = input('Ajusta o limpia los filtros para ver resultados.');
  readonly limpiar = output();
}