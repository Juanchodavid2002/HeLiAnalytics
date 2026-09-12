const MESES_ESP = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export function formatearNumero(n: number | undefined | null): string {
  if (n === undefined || n === null || Number.isNaN(n)) {
    return '—';
  }
  return n.toLocaleString('es-CO');
}

export function formatearPorcentaje(p: number | undefined | null): string {
  if (p === undefined || p === null || Number.isNaN(p)) {
    return '—';
  }
  return `${p.toLocaleString('es-CO', { maximumFractionDigits: 1 })}%`;
}

export function formatearDias(d: number | undefined | null): string {
  if (d === undefined || d === null || Number.isNaN(d)) {
    return '—';
  }
  return `${d.toLocaleString('es-CO', { maximumFractionDigits: 1 })} días`;
}

export function titleCase(valor: string | undefined | null): string {
  if (!valor) {
    return '—';
  }
  return valor
    .toLowerCase()
    .split(' ')
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}

export function nombreMes(numero: number): string {
  return MESES_ESP[numero - 1] ?? `${numero}`;
}

export function formatearFecha(iso: string | undefined): string {
  if (!iso) {
    return '—';
  }
  const [anio, mes, dia] = iso.split('-').map(Number);
  const fecha = new Date(anio, (mes ?? 1) - 1, dia ?? 1);
  return `${MESES_ESP[fecha.getMonth()]} ${fecha.getFullYear()}`;
}