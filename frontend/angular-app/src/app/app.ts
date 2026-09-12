import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from './shared/sidebar/sidebar';
import { FilterBar } from './shared/filter-bar/filter-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, FilterBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly colapsado = signal(false);
  protected readonly abierto = signal(false);

  alternarMovil(): void {
    this.abierto.set(!this.abierto());
  }
}