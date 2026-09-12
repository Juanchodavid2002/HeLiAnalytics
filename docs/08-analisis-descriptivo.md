# 08 — Análisis Descriptivo (EDA)

## Objetivo

Realizar un análisis exploratorio de datos (EDA) completo que permita comprender la estructura, comportamiento y relaciones de las variables en el dataset de PQRS de HeLi Salud IPS.

---

## Distribuciones individuales

### Distribución por tipo de PQRS

| Aspecto | Detalle |
|---------|---------|
| Variable | Tipo de PQRS |
| Tipo | Categórica nominal |
| Métricas | Frecuencia absoluta, frecuencia relativa, porcentaje |
| Visualización | Gráfico de barras horizontal |
| Pregunta analítica | ¿Qué tipos de PQRS predominan? ¿Cuál es la proporción de cada tipo? |

**Estructura de salida:**

```json
{
  "tipo_pqrs": {
    "total_registros": 2252,
    "distribucion": [
      {"categoria": "Queja", "frecuencia": 0, "porcentaje": 0.0},
      {"categoria": "Reclamo", "frecuencia": 0, "porcentaje": 0.0},
      {"categoria": "Petición", "frecuencia": 0, "porcentaje": 0.0},
      {"categoria": "Sugerencia", "frecuencia": 0, "porcentaje": 0.0}
    ]
  }
}
```

### Distribución por causa de inconformidad

| Aspecto | Detalle |
|---------|---------|
| Variable | Causa de inconformidad |
| Tipo | Categórica nominal |
| Métricas | Frecuencia absoluta, porcentaje, ranking |
| Visualización | Gráfico de barras horizontal (top N), treemap |
| Pregunta analítica | ¿Cuáles son las causas más frecuentes? ¿Cómo se distribuyen? |

### Distribución por canal de ingreso

| Aspecto | Detalle |
|---------|---------|
| Variable | Canal de ingreso |
| Tipo | Categórica nominal |
| Métricas | Frecuencia absoluta, porcentaje |
| Visualización | Gráfico de barras, donut chart |
| Pregunta analítica | ¿Qué canales utiliza preferentemente la población? |

### Distribución por servicio

| Aspecto | Detalle |
|---------|---------|
| Variable | Servicio asociado |
| Tipo | Categórica nominal |
| Métricas | Frecuencia absoluta, porcentaje |
| Visualización | Gráfico de barras horizontal |
| Pregunta analítica | ¿Qué servicios generan más PQRS? |

### Distribución temporal

| Aspecto | Detalle |
|---------|---------|
| Variable | Fecha de radicación |
| Tipo | Temporal (datetime) |
| Métricas | PQRS por mes, por semana, tendencia |
| Visualización | Gráfico de líneas, gráfico de área |
| Pregunta analítica | ¿Hay tendencia temporal? ¿Meses con picos? |

**Desagregaciones temporales:**

- PQRS por mes (julio a diciembre 2025)
- PQRS por semana del año
- PQRS por día de la semana (lunes a domingo)

### Distribución por estado

| Aspecto | Detalle |
|---------|---------|
| Variable | Estado de la solicitud |
| Tipo | Categórica ordinal |
| Métricas | Frecuencia absoluta, porcentaje |
| Visualización | Gráfico de barras, indicador de tasa de cierre |
| Pregunta analítica | ¿Qué porcentaje de PQRS están cerradas vs. abiertas? |

### Distribución del tiempo de respuesta

| Aspecto | Detalle |
|---------|---------|
| Variable | Tiempo de respuesta |
| Tipo | Numérica continua |
| Métricas | Media, mediana, desviación estándar, min, max, percentiles |
| Visualización | Histograma, boxplot |
| Pregunta analítica | ¿Cuál es el tiempo promedio? ¿Hay valores atípicos? |

---

## Cruces de variables

Los cruces se realizan para identificar relaciones entre pares de variables. Solo se incluyen cruces con valor analítico real.

### Tipo × Causa

| Aspecto | Detalle |
|---------|---------|
| Variables | Tipo de PQRS × Causa de inconformidad |
| Visualización | Gráfico de barras agrupadas, heatmap |
| Pregunta | ¿Qué causas predominan en cada tipo de PQRS? |

### Tipo × Servicio

| Aspecto | Detalle |
|---------|---------|
| Variables | Tipo de PQRS × Servicio asociado |
| Visualización | Gráfico de barras agrupadas, heatmap |
| Pregunta | ¿Qué servicios generan más quejas vs. reclamos vs. peticiones? |

### Causa × Servicio

| Aspecto | Detalle |
|---------|---------|
| Variables | Causa de inconformidad × Servicio asociado |
| Visualización | Heatmap, gráfico de barras agrupadas |
| Pregunta | ¿Qué causas están asociadas a cada servicio? |

### Causa × Canal

| Aspecto | Detalle |
|---------|---------|
| Variables | Causa de inconformidad × Canal de ingreso |
| Visualización | Heatmap |
| Pregunta | ¿Los pacientes radicaron ciertas causas por canales específicos? |

### Servicio × Canal

| Aspecto | Detalle |
|---------|---------|
| Variables | Servicio asociado × Canal de ingreso |
| Visualización | Heatmap |
| Pregunta | ¿Qué canales utilizan los pacientes de cada servicio? |

### Servicio × Tiempo de respuesta

| Aspecto | Detalle |
|---------|---------|
| Variables | Servicio asociado × Tiempo de respuesta |
| Visualización | Boxplot por servicio |
| Pregunta | ¿Algunos servicios tienen tiempos de respuesta significativamente mayores? |

### Causa × Tiempo de respuesta

| Aspecto | Detalle |
|---------|---------|
| Variables | Causa de inconformidad × Tiempo de respuesta |
| Visualización | Boxplot por causa |
| Pregunta | ¿Algunas causas tienen tiempos de respuesta diferentes? |

---

## Resumen de visualizaciones

| # | Visualización | Variables | Tipo de gráfico | Página en la app |
|---|--------------|-----------|-----------------|------------------|
| 1 | Distribución por tipo | Tipo de PQRS | Barras horizontales | Dashboard / Tendencias |
| 2 | Distribución por causa | Causa | Barras horizontales + treemap | Causas |
| 3 | Distribución por canal | Canal | Barras + donut | Tendencias |
| 4 | Distribución por servicio | Servicio | Barras horizontales | Servicios |
| 5 | Tendencia temporal | Fecha | Líneas + área | Tendencias |
| 6 | Distribución por estado | Estado | Barras + indicador | Dashboard |
| 7 | Tiempo de respuesta | Tiempo | Histograma + boxplot | Dashboard |
| 8 | Tipo × Causa | Tipo × Causa | Barras agrupadas / heatmap | Causas |
| 9 | Tipo × Servicio | Tipo × Servicio | Barras agrupadas | Servicios |
| 10 | Causa × Servicio | Causa × Servicio | Heatmap | Causas / Servicios |
| 11 | Causa × Canal | Causa × Canal | Heatmap | Tendencias |
| 12 | Servicio × Canal | Servicio × Canal | Heatmap | Servicios |
| 13 | Servicio × Tiempo | Servicio × Tiempo | Boxplot | Servicios |
| 14 | Causa × Tiempo | Causa × Tiempo | Boxplot | Causas |

---

## Estructura del notebook de EDA

```python
# Estructura conceptual del notebook

# 1. Imports
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 2. Carga del dataset analítico
df = pd.read_csv("data/processed/pqrs_analitico_v2.csv")

# 3. Inspección general
# shape, dtypes, head, info, describe

# 4. Distribuciones individuales
# Para cada variable: frecuencias, gráficos

# 5. Cruces de variables
# Para cada cruce: tablas dinámicas, gráficos

# 6. Análisis temporal
# Series de tiempo, tendencias

# 7. Análisis de tiempo de respuesta
# Estadísticas, distribución, outliers

# 8. Resumen de hallazgos
# Principales observaciones del EDA

# 9. Exportación de resultados
# JSON con todas las distribuciones y cruces
```

---

## Criterios de calidad del EDA

- [ ] Todas las variables categóricas tienen distribución de frecuencias
- [ ] Todas las variables numéricas tienen estadísticas descriptivas
- [ ] Se han realizado al menos 5 cruces de variables relevantes
- [ ] Cada gráfico tiene título, etiquetas y leyenda
- [ ] Los resultados se exportan en formato JSON
- [ ] Se documentan hallazgos iniciales
- [ ] No se interpretan correlaciones como causalidad
