# 13 — Dashboard

## Objetivo

El dashboard principal de HeLi Analytics presenta una vista consolidada de los indicadores clave de las PQRS, permitiendo al usuario comprender rápidamente la situación general antes de explorar detalles en otras páginas.

---

## KPIs del Dashboard Principal

Los siguientes indicadores se muestran como cards en la parte superior del dashboard:

| # | KPI | Descripción | Fuente |
|---|-----|-------------|--------|
| 1 | **Total PQRS analizadas** | Cantidad total de registros del periodo | `resumen.total_pqrs` |
| 2 | **Quejas** | Cantidad y % de registros clasificados como Queja | `resumen.distribucion_tipo.Queja` |
| 3 | **Reclamos** | Cantidad y % de registros clasificados como Reclamo | `resumen.distribucion_tipo.Reclamo` |
| 4 | **Peticiones** | Cantidad y % de registros clasificados como Petición | `resumen.distribucion_tipo.Peticion` |
| 5 | **Sugerencias** | Cantidad y % de registros clasificados como Sugerencia | `resumen.distribucion_tipo.Sugerencia` |
| 6 | **Tiempo promedio respuesta** | Promedio de días entre radicación y cierre | `resumen.tiempo_promedio_respuesta_dias` |
| 7 | **Causa más frecuente** | La causa con mayor número de registros | `resumen.causa_mas_frecuente` |
| 8 | **Canal más utilizado** | El canal de ingreso predominante | `resumen.canal_mas_utilizado` |
| 9 | **Servicio con más PQRS** | El servicio con mayor concentración | `resumen.servicio_mas_pqrs` |

> Los valores se obtienen exclusivamente de los datos reales. No se utilizan valores ficticios.

---

## Layout del Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  HeLi Analytics — Centro de Inteligencia de PQRS            │
│  Periodo: Julio - Diciembre 2025                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Total    │ │ Quejas   │ │ Reclamos │ │ Tiempo   │      │
│  │ PQRS     │ │ X (XX%)  │ │ X (XX%)  │ │ Prom.    │      │
│  │ 2,252    │ │          │ │          │ │ X días   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│  ┌──────────────────────────┐ ┌──────────────────────────┐  │
│  │                          │ │                          │  │
│  │   DISTRIBUCIÓN POR TIPO  │ │   TENDENCIA TEMPORAL     │  │
│  │                          │ │                          │  │
│  │   [Gráfico de barras]    │ │   [Gráfico de líneas]    │  │
│  │                          │ │                          │  │
│  └──────────────────────────┘ └──────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────┐ ┌──────────────────────────┐  │
│  │                          │ │                          │  │
│  │   TOP CAUSAS             │ │   DISTRIBUCIÓN POR       │  │
│  │                          │ │   CANAL                  │  │
│  │   [Gráfico de barras     │ │                          │  │
│  │    horizontales]         │ │   [Gráfico donut]        │  │
│  │                          │ │                          │  │
│  └──────────────────────────┘ └──────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Visualizaciones del Dashboard

### Gráfico 1: Distribución por tipo de PQRS

| Propiedad | Valor |
|-----------|-------|
| Tipo | Gráfico de barras vertical |
| Eje X | Tipo de PQRS |
| Eje Y | Cantidad de registros |
| Colores | Distinto color por tipo |
| Tooltip | Cantidad exacta y porcentaje |
| Pregunta analítica | ¿Qué tipos de PQRS predominan? |

### Gráfico 2: Tendencia temporal

| Propiedad | Valor |
|-----------|-------|
| Tipo | Gráfico de líneas con área sombreada |
| Eje X | Mes (julio a diciembre 2025) |
| Eje Y | Cantidad de PQRS |
| Línea | Una línea por tipo de PQRS (opcionally) |
| Tooltip | Cantidad exacta por mes |
| Pregunta analítica | ¿Hay tendencia creciente, decreciente o estable? |

### Gráfico 3: Top causas

| Propiedad | Valor |
|-----------|-------|
| Tipo | Gráfico de barras horizontal |
| Eje X | Cantidad de registros |
| Eje Y | Causa de inconformidad |
| Orden | De mayor a menor frecuencia |
| Top | 10 primeras causas |
| Tooltip | Cantidad y porcentaje |
| Pregunta analítica | ¿Cuáles son las causas más críticas? |

### Gráfico 4: Distribución por canal

| Propiedad | Valor |
|-----------|-------|
| Tipo | Donut chart |
| Segmentos | Cada canal de ingreso |
| Centro | Total de registros |
| Tooltip | Cantidad y porcentaje |
| Pregunta analítica | ¿Qué canales son más utilizados? |

---

## Filtros del Dashboard

El dashboard incluye filtros globales que afectan todos los gráficos:

| Filtro | Tipo | Valores |
|--------|------|---------|
| Periodo | Multi-select | Jul, Ago, Sep, Oct, Nov, Dic 2025 |
| Servicio | Multi-select | Servicios disponibles en los datos |
| Tipo de PQRS | Multi-select | Petición, Queja, Reclamo, Sugerencia |
| Causa | Multi-select | Causas disponibles en los datos |
| Canal | Multi-select | Canales disponibles en los datos |
| Cluster | Multi-select | Clusters resultantes de la segmentación |

---

## Estados

### Estado de carga

- Skeleton screens para cada KPI y gráfico.
- Spinner central para carga inicial.

### Estado vacío

- Cuando los filtros no devuelven resultados:
  - Mensaje: "No se encontraron registros para los filtros seleccionados."
  - Ilustración simple.
  - Botón "Limpiar filtros".

### Estado de error

- Mensaje de error amigable.
- Botón "Reintentar".

---

## Interactividad

| Interacción | Comportamiento |
|------------|---------------|
| Clic en barra de tipo | Filtra por ese tipo (navega o aplica filtro) |
| Hover en gráfico | Tooltip con datos exactos |
| Cambio de filtro | Actualiza todos los gráficos |
| Scroll | Sidebar fijo, contenido scrollable |
| Resize | Gráficos se re-adaptan al tamaño |

---

## Responsive

| Breakpoint | Comportamiento |
|-----------|---------------|
| Desktop (> 1280px) | Layout completo: sidebar + 2 columnas de gráficos |
| Tablet (768-1280px) | Sidebar colapsado, gráficos en 1-2 columnas |
| Mobile (< 768px) | Sidebar como menú, gráficos en 1 columna, KPIs en 2 columnas |
