import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface ItemNav {
  ruta: string;
  etiqueta: string;
  icono: string;
  seccion?: 'principal' | 'analisis';
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly colapsado = input(false);
  readonly abierto = input(false);
  readonly colapsar = output();
  readonly cerrarEnMovil = output();

  readonly items: ItemNav[] = [
    { ruta: '/dashboard', etiqueta: 'Dashboard', icono: 'squares', seccion: 'principal' },
    { ruta: '/tendencias', etiqueta: 'Tendencias', icono: 'trend', seccion: 'principal' },
    { ruta: '/causas', etiqueta: 'Causas', icono: 'alert', seccion: 'principal' },
    { ruta: '/servicios', etiqueta: 'Servicios', icono: 'files', seccion: 'principal' },
    { ruta: '/segmentacion', etiqueta: 'Segmentación', icono: 'users', seccion: 'analisis' },
    { ruta: '/textual', etiqueta: 'Análisis Textual', icono: 'text', seccion: 'analisis' },
    { ruta: '/insights', etiqueta: 'Insights IA', icono: 'bulb', seccion: 'analisis', badge: 'NEW' },
  ];

  readonly secciones: { etiqueta: string; items: ItemNav[] }[] = [
    { etiqueta: 'Principal', items: this.items.filter((i) => i.seccion === 'principal' || !i.seccion) },
    { etiqueta: 'Análisis', items: this.items.filter((i) => i.seccion === 'analisis') },
  ];
}