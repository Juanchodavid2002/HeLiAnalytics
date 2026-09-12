import { Component, input } from '@angular/core';

export type KpiColor = 'primary' | 'secondary' | 'accent' | 'alerta' | 'error';

const COLORES: Record<KpiColor, { fondo: string; texto: string; soft: string }> = {
  primary: { fondo: 'bg-blue-500', texto: 'text-blue-600', soft: 'rgba(37,99,235,0.1)' },
  secondary: { fondo: 'bg-violet-500', texto: 'text-violet-600', soft: 'rgba(124,58,237,0.1)' },
  accent: { fondo: 'bg-emerald-500', texto: 'text-emerald-600', soft: 'rgba(16,185,129,0.1)' },
  alerta: { fondo: 'bg-amber-500', texto: 'text-amber-600', soft: 'rgba(245,158,11,0.1)' },
  error: { fondo: 'bg-rose-500', texto: 'text-rose-600', soft: 'rgba(239,68,68,0.1)' },
};

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
})
export class KpiCard {
  readonly titulo = input('');
  readonly valor = input('');
  readonly subtexto = input('');
  readonly icono = input('chart');
  readonly color = input<KpiColor>('primary');
  readonly tag = input('');
  readonly tagClase = input('bg-emerald-50 text-emerald-600');
  readonly mostrarSparkline = input(false);

  paleta(color: KpiColor): { fondo: string; texto: string } {
    return COLORES[color] ?? COLORES.primary;
  }

  cssVars(): Record<string, string> {
    return { '--accent-soft': (COLORES[this.color()] ?? COLORES.primary).soft };
  }
}