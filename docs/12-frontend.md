# 12 — Frontend (Angular)

## Visión general

HeLi Analytics es una aplicación Angular 17+ que consume la API de FastAPI y presenta los resultados del análisis de PQRS en una interfaz de Business Intelligence interactiva y profesional.

---

## Stack tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | Angular | 17+ |
| Componentes | Standalone Components | — |
| Tipado | TypeScript | 5.0+ |
| Estilos | Tailwind CSS | 3.0+ |
| Gráficos | Apache ECharts (ngx-echarts) | 5.0+ |
| HTTP Client | Angular HttpClient | — |
| Router | Angular Router | — |

---

## Arquitectura del frontend

```
frontend/angular-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts         # Componente raíz
│   │   ├── app.component.html
│   │   ├── app.routes.ts            # Definición de rutas
│   │   ├── app.config.ts            # Configuración de providers
│   │   │
│   │   ├── core/                    # Servicios, modelos, utilidades
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts        # Consumo de la API
│   │   │   │   └── filter.service.ts     # Estado global de filtros
│   │   │   ├── models/
│   │   │   │   ├── resumen.model.ts
│   │   │   │   ├── distribucion.model.ts
│   │   │   │   ├── cluster.model.ts
│   │   │   │   └── insight.model.ts
│   │   │   └── utils/
│   │   │       └── formatters.ts    # Formateo de números, fechas
│   │   │
│   │   ├── shared/                  # Componentes reutilizables
│   │   │   ├── sidebar/
│   │   │   │   └── sidebar.component.ts
│   │   │   ├── kpi-card/
│   │   │   │   └── kpi-card.component.ts
│   │   │   ├── filter-bar/
│   │   │   │   └── filter-bar.component.ts
│   │   │   ├── chart-container/
│   │   │   │   └── chart-container.component.ts
│   │   │   ├── loading/
│   │   │   │   └── loading.component.ts
│   │   │   └── empty-state/
│   │   │       └── empty-state.component.ts
│   │   │
│   │   └── pages/                   # Páginas principales
│   │       ├── dashboard/
│   │       │   └── dashboard.component.ts
│   │       ├── tendencias/
│   │       │   └── tendencias.component.ts
│   │       ├── causas/
│   │       │   └── causas.component.ts
│   │       ├── servicios/
│   │       │   └── servicios.component.ts
│   │       ├── segmentacion/
│   │       │   └── segmentacion.component.ts
│   │       ├── textual/
│   │       │   └── textual.component.ts
│   │       └── insights/
│   │           └── insights.component.ts
│   │
│   ├── styles.css                   # Estilos globales + Tailwind
│   ├── index.html
│   └── main.ts
│
├── tailwind.config.js
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Rutas

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tendencias', component: TendenciasComponent },
  { path: 'causas', component: CausasComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'segmentacion', component: SegmentacionComponent },
  { path: 'textual', component: TextualComponent },
  { path: 'insights', component: InsightsComponent },
];
```

---

## Páginas

### Dashboard (Resumen)

| Elemento | Descripción |
|----------|-------------|
| KPIs | Total PQRS, distribución por tipo, causa más frecuente, canal más usado, tiempo promedio, servicio con más PQRS |
| Gráfico 1 | Distribución por tipo de PQRS (barras) |
| Gráfico 2 | Tendencia temporal (líneas) |
| Gráfico 3 | Top causas (barras horizontales) |

### Tendencias

| Elemento | Descripción |
|----------|-------------|
| Filtros | Periodo, servicio, tipo |
| Gráfico 1 | PQRS por mes (líneas) |
| Gráfico 2 | PQRS por semana (líneas) |
| Gráfico 3 | Distribución por canal (barras + donut) |
| Gráfico 4 | Causa × Canal (heatmap) |

### Causas

| Elemento | Descripción |
|----------|-------------|
| Filtros | Tipo, servicio, canal, periodo |
| Gráfico 1 | Ranking de causas (barras horizontales) |
| Gráfico 2 | Causa × Tipo (barras agrupadas) |
| Gráfico 3 | Causa × Servicio (heatmap) |
| Gráfico 4 | Causa × Tiempo de respuesta (boxplot) |

### Servicios

| Elemento | Descripción |
|----------|-------------|
| Filtros | Tipo, causa, canal, periodo |
| Gráfico 1 | Distribución por servicio (barras) |
| Gráfico 2 | Servicio × Tipo (barras agrupadas) |
| Gráfico 3 | Servicio × Causa (heatmap) |
| Gráfico 4 | Servicio × Tiempo de respuesta (boxplot) |

### Segmentación

| Elemento | Descripción |
|----------|-------------|
| Resumen | Número de clusters, algoritmo utilizado, métricas de calidad |
| Vista general | Distribución de registros por cluster (barras o treemap) |
| Selección | Al hacer clic en un cluster, mostrar su perfil detallado |
| Perfil | Variables predominantes, cantidad, participación %, interpretación |

### Análisis textual

| Elemento | Descripción |
|----------|-------------|
| Condicional | Solo se muestra si hay datos textuales |
| Gráfico 1 | Top 20 palabras frecuentes (barras) |
| Gráfico 2 | Top 10 bigramas (barras) |
| Gráfico 3 | Palabras por tipo de PQRS (barras agrupadas) |
| Gráfico 4 | Nube de palabras (opcional) |

### Insights

| Elemento | Descripción |
|----------|-------------|
| Formato | Cards con hallazgos, oportunidades y tendencias |
| Contenido | Generado exclusivamente desde datos reales |
| Estructura | Título + descripción + métrica + valor |

---

## Componentes compartidos

### Sidebar

- Navegación lateral con iconos y etiquetas.
- Resalta la página activa.
- Colapsable en mobile.
- Logo de HeLi Analytics.

### KPI Card

- Muestra un indicador clave: título, valor, tendencia (si aplica).
- Diseño limpio con icono.
- Color codificado por tipo de indicador.

### Filter Bar

- Barra horizontal de filtros.
- Dropdowns para cada dimensión.
- Los filtros afectan todos los gráficos de la página.
- Botón para limpiar filtros.

### Chart Container

- Wrapper para gráficos ECharts.
- Título, subtítulo, tooltip.
- Estado de carga (skeleton).
- Estado vacío.

### Loading

- Skeleton screens o spinner.
- Se muestra mientras se cargan datos de la API.

### Empty State

- Mensaje informativo cuando no hay datos para un filtro o sección.

---

## Servicios

### ApiService

```typescript
// Consumo de la API
@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  getResumen(): Observable<Resumen>
  getDistribuciones(variable?: string): Observable<Distribuciones>
  getTemporal(): Observable<Temporal>
  getCruces(variables: string): Observable<Cruce>
  getClusters(): Observable<Clusters>
  getCluster(id: number): Observable<ClusterDetalle>
  getInsights(): Observable<Insights>
  getTextual(): Observable<Textual>
  getFiltros(): Observable<Filtros>
}
```

### FilterService

```typescript
// Estado global de filtros
@Injectable({ providedIn: 'root' })
export class FilterService {
  filtros$ = new BehaviorSubject<FiltrosActivos>({
    periodo: null,
    servicio: null,
    tipo: null,
    causa: null,
    canal: null,
    cluster: null
  });

  actualizarFiltro(filtro: Partial<FiltrosActivos>): void
  limpiarFiltros(): void
}
```

---

## Diseño visual

### Principios

- **Datos + Salud + Tecnología + Inteligencia**
- Jerarquía visual clara
- Espaciado generoso
- Paleta de colores profesional y sobria
- Sin elementos innecesarios

### Paleta de colores (propuesta)

| Uso | Color | Hex |
|-----|-------|-----|
| Primario | Azul oscuro | #1E3A5F |
| Secundario | Azul medio | #2563EB |
| Acento | Teal | #0D9488 |
| Alerta | Ámbar | #F59E0B |
| Error | Rojo | #DC2626 |
| Fondo | Gris claro | #F8FAFC |
| Texto principal | Gris oscuro | #1E293B |
| Texto secundario | Gris medio | #64748B |

### Tipografía

| Elemento | Fuente | Peso |
|----------|--------|------|
| Títulos | Inter / system-ui | 600-700 |
| Cuerpo | Inter / system-ui | 400-500 |
| Monospace (KPIs) | JetBrains Mono / monospace | 500 |

### Layout

```
┌──────────────────────────────────────────────┐
│  HEADER (logo + título + filtros globales)   │
├──────────┬───────────────────────────────────┤
│          │                                   │
│ SIDEBAR  │         CONTENIDO PRINCIPAL       │
│          │                                   │
│ Dashboard│    ┌──────┐ ┌──────┐ ┌──────┐    │
│ Tenden.  │    │ KPI  │ │ KPI  │ │ KPI  │    │
│ Causas   │    └──────┘ └──────┘ └──────┘    │
│ Servic.  │                                   │
│ Segment. │    ┌──────────────────────────┐   │
│ Textual  │    │      GRÁFICO PRINCIPAL   │   │
│ Insights │    └──────────────────────────┘   │
│          │                                   │
│          │    ┌──────────┐ ┌──────────┐     │
│          │    │ GRÁFICO  │ │ GRÁFICO  │     │
│          │    └──────────┘ └──────────┘     │
│          │                                   │
└──────────┴───────────────────────────────────┘
```

---

## Responsive design

| Breakpoint | Comportamiento |
|-----------|---------------|
| Desktop (> 1024px) | Sidebar + contenido lado a lado |
| Tablet (768-1024px) | Sidebar colapsable, gráficos en 2 columnas |
| Mobile (< 768px) | Sidebar como menú hamburguesa, gráficos en 1 columna |
