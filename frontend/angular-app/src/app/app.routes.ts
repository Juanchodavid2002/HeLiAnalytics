import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard) },
  { path: 'tendencias', loadComponent: () => import('./pages/tendencias/tendencias').then((m) => m.Tendencias) },
{ path: 'ambito', loadComponent: () => import('./pages/ambito/ambito').then((m) => m.Ambito) },
  { path: 'areas', loadComponent: () => import('./pages/areas/areas').then((m) => m.Areas) },
  { path: 'segmentacion', loadComponent: () => import('./pages/segmentacion/segmentacion').then((m) => m.Segmentacion) },
  { path: 'textual', loadComponent: () => import('./pages/textual/textual').then((m) => m.PaginaTextual) },
  { path: 'insights', loadComponent: () => import('./pages/insights/insights').then((m) => m.PaginaInsights) },
];
