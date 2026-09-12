# 07 — Pipeline de Datos

## Visión general

El pipeline de datos define el flujo reproducible que transforma los datos crudos de PQRS en resultados analíticos listos para ser consumidos por la API y el frontend.

**Regla fundamental**: Nunca se modifica el archivo original. Se generan datasets derivados para cada etapa.

---

## Diagrama del pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                     PIPELINE DE DATOS                       │
└─────────────────────────────────────────────────────────────┘

  ┌──────────────┐
  │ 1. DATOS     │   Archivo original proporcionado por
  │    ORIGINALES│   HeLi Salud IPS
  │              │   (Excel / CSV)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 2. CARGA     │   Lectura del dataset
  │              │   Detección de encoding, separador
  │              │   Inspección inicial: shape, dtypes, head
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 3. VALIDACIÓN│   Verificación de estructura
  │    INICIAL   │   Columnas esperadas vs. reales
  │              │   Tipos de datos
  │              │   Conteo de registros
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 4. PERFILAM. │   Perfilamiento automatizado
  │              │   Nulos por columna
  │              │   Valores únicos
  │              │   Estadísticas descriptivas
  │              │   ydata-profiling (opcional)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 5. LIMPIEZA  │   Eliminación de duplicados
  │              │   Tratamiento de nulos
  │              │   Corrección de tipos
  │              │   Manejo de valores atípicos
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 6. ESTANDAR. │   Normalización de categorías
  │              │   Minúsculas, sin espacios extras
  │              │   Unificación de variaciones
  │              │   Estandarización de fechas
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 7. TRATAM.   │   Definición de estrategia por columna:
  │    NULOS     │   - Eliminar registro
  │              │   - Imputar con moda/mediana
  │              │   - Marcar como "No especificado"
  │              │   Documentar decisión para cada caso
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 8. DUPLICA-  │   Detección de registros idénticos
  │    DOS       │   Decisión: eliminar o mantener
  │              │   Documentar criterio
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 9. VALID.    │   Verificación de categorías
  │    CATEGORÍAS│   Contra catálogo conocido
  │              │   Detección de categorías espurias
  │              │   Consolidación si es necesario
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 10. FEATURE  │   Creación de variables derivadas:
  │     ENGINEER.│   - Mes de radicación
  │              │   - Semana del año
  │              │   - Trimestre
  │              │   - Días de respuesta (calculado)
  │              │   - Categorías agrupadas
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 11. DATASET  │   Exportación del dataset limpio
  │    ANALÍTICO │   a data/processed/
  │              │   Formato: CSV
  │              │   Nombre descriptivo con versión
  └──────┬───────┘
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
  ┌──────────────┐     ┌──────────────┐
  │ 12a. EDA     │     │ 12b. CLUSTER.│
  │              │     │              │
  │ Análisis     │     │ Segmentación │
  │ exploratorio │     │ K-Modes /    │
  │ completo     │     │ K-Prototypes │
  └──────┬───────┘     └──────┬───────┘
         │                      │
         ▼                      ▼
  ┌──────────────┐     ┌──────────────┐
  │ Resultados   │     │ Resultados   │
  │ descriptivos │     │ de clusters  │
  │ (.json)      │     │ (.json)      │
  └──────┬───────┘     └──────┬───────┘
         │                      │
         └──────────┬───────────┘
                    │
                    ▼
           ┌──────────────┐
           │ 13. EXPORT.  │
           │    CONSOL.   │
           │              │
           │ Archivos JSON│
           │ para la API  │
           └──────────────┘
```

---

## Descripción detallada de cada etapa

### 1. Datos originales

| Aspecto | Detalle |
|---------|---------|
| Ubicación | `data/raw/` |
| Formato | CSV o Excel |
| Protección | Archivo de solo lectura — nunca se modifica |
| Nombre sugerido | `pQRS_HeLi_Salud_2025_S2.csv` o similar |

### 2. Carga

```python
# Ejemplo conceptual (no es código final)
import pandas as pd

df = pd.read_csv("data/raw/pqrs_heli_2025_s2.csv")
print(f"Registros: {df.shape[0]}")
print(f"Columnas: {df.shape[1]}")
print(df.dtypes)
print(df.head())
```

**Acciones:**
- Detectar encoding automáticamente (utf-8, latin-1, cp1252)
- Detectar separador (coma, punto y coma, tab)
- Registrar dimensiones iniciales

### 3. Validación inicial

**Verificar:**
- [ ] Columnas esperadas presentes
- [ ] Tipos de datos consistentes
- [ ] Rango de fechas dentro del periodo (julio-dic 2025)
- [ ] No hay filas completamente vacías
- [ ] La cantidad de registros es consistente (~2,252)

### 4. Perfilamiento

**Generar reporte con:**
- Porcentaje de nulos por columna
- Valores únicos por columna categórica
- Estadísticas descriptivas por columna numérica
- Distribución de la variable objetivo (tipo de PQRS)
- Detección de duplicados parciales y totales

### 5. Limpieza

| Problema | Acción |
|----------|--------|
| Duplicados exactos | Eliminar, mantener primera instancia |
| Duplicados parciales | Analizar caso por caso |
| Nulos en variables categóricas | Marcar como "No especificado" o eliminar |
| Nulos en tiempo de respuesta | Verificar si son PQRS abiertas |
| Tipos incorrectos | Convertir a tipo correcto |
| Valores atípicos en tiempo | Verificar y documentar |

### 6. Estandarización

**Categorías:**
- Convertir a minúsculas
- Eliminar espacios al inicio y final
- Unificar variaciones (ej: "queja" vs "Queja " vs "QUEJA")
- Verificar contra catálogo conocido

**Fechas:**
- Convertir a formato datetime统一
- Extraer: mes, semana del año, trimestre
- Crear columna `dias_respuesta` si es calculable

### 7. Tratamiento de nulos

| Columna | Estrategia | Justificación |
|---------|-----------|---------------|
| Tipo de PQRS | Eliminar registro si es nulo | Variable crítica sin valor de sustitución |
| Causa | Marcar "No especificado" | Puede perder información si se elimina |
| Canal | Marcar "No especificado" | Puede perder información si se elimina |
| Servicio | Marcar "No especificado" | Puede perder información si se elimina |
| Tiempo de respuesta | Verificar si PQRS abierta | Puede ser legítimamente nulo |
| Fecha | Eliminar registro | Necesaria para análisis temporal |

> Las estrategias definitivas se definirán una vez se conozca el perfil real de nulos.

### 8. Detección de duplicados

```python
# Duplicados exactos
duplicados_total = df.duplicated().sum()

# Duplicados parciales (misma fecha + causa + servicio)
duplicados_parcial = df.duplicated(
    subset=["fecha_radicacion", "causa", "servicio"],
    keep="first"
).sum()
```

### 9. Validación de categorías

- Comparar categorías encontradas contra catálogo conocido
- Detectar categorías con frecuencia muy baja (< 5 registros)
- Decisión: consolidar, agrupar "Otro" o mantener
- Documentar cada decisión

### 10. Feature engineering

| Variable derivada | Origen | Tipo |
|-------------------|--------|------|
| `mes` | `fecha_radicacion` | Categórica |
| `semana` | `fecha_radicacion` | Numérica |
| `trimestre` | `fecha_radicacion` | Categórica |
| `dias_respuesta` | `fecha_cierre` - `fecha_radicacion` | Numérica |
| `causa_agrupada` | `causa` (agrupación) | Categórica |

### 11. Dataset analítico

| Aspecto | Detalle |
|---------|---------|
| Ubicación | `data/processed/` |
| Formato | CSV |
| Nombre | `pqrs_analitico_v2.csv` |
| Contiene | Dataset limpio, estandarizado, con variables derivadas |
| Actualización | Generado por el notebook de pipeline |

### 12. Análisis y clustering

Se generan dos flujos paralelos:
- **EDA**: Notebooks de análisis exploratorio → resultados descriptivos
- **Clustering**: Notebook de segmentación → resultados de clusters

### 13. Exportación consolidada

Los resultados de ambos flujos se consolidan en archivos JSON listos para ser consumidos por la API.

**Archivos JSON esperados:**

| Archivo | Contenido |
|---------|-----------|
| `resumen.json` | KPIs generales del dashboard |
| `distribuciones.json` | Frecuencias y distribuciones por variable |
| `cruces.json` | Resultados de cruces de variables |
| `clusters.json` | Resultados del clustering |
| `insights.json` | Insights generados desde los datos |
| `temporal.json` | Distribución temporal |
| `texto.json` | Resultados del análisis textual (si aplica) |

---

## Versionado de datasets

Cada versión del dataset analítico se nombra con versión:

```
pqrs_analitico_v1.csv    ← Primera versión (2,261 registros, sin deduplicación)
pqrs_analitico_v2.csv    ← Limpieza completa (2,252 registros: dedup, imputación, winsorización)
```

Los cambios se documentan en el archivo `data/processed/CHANGELOG.md`.

---

## Reglas del pipeline

1. **No modificar `data/raw/`**: Los datos originales son intocables.
2. **Documentar cada decisión**: Especialmente en limpieza y tratamiento de nulos.
3. **Reproducibilidad**: El pipeline debe ejecutarse de forma secuencial sin intervención manual.
4. **Idempotencia**: Ejecutar el pipeline múltiples veces produce el mismo resultado.
5. **Trazabilidad**: Cada dataset derivado puede rastrearse hasta el original.
