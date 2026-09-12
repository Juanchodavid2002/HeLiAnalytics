# 04 — Datos y Diccionario

## Fuente de datos

| Aspecto | Detalle |
|---------|---------|
| Institución | HeLi Salud IPS |
| Periodo | Segundo semestre de 2025 (julio - diciembre) |
| Población | 2,252 registros de PQRS |
| Tipo de muestreo | Censo (totalidad de la población) |
| Fuente | Base de datos institucional de PQRS |

---

## Variables identificadas en el documento académico

El documento del proyecto menciona las siguientes variables como parte de los registros de PQRS:

### Variables principales

| # | Variable | Descripción | Fuente en documento |
|---|----------|-------------|---------------------|
| 1 | Tipo de PQRS | Clasificación de la solicitud (Petición, Queja, Reclamo, Sugerencia) | §8.5, §8.6 |
| 2 | Causa de inconformidad | Motivo o causa de la PQRS | §8.5, §8.6 |
| 3 | Canal de ingreso | Medio por el cual se radicó la PQRS | §8.5, §8.6 |
| 4 | Servicio asociado | Servicio de salud mental relacionado con la PQRS | §8.5, §8.6 |
| 5 | Estado de la solicitud | Estado actual de la PQRS (resuelta, en trámite, etc.) | §8.6 |
| 6 | Tiempo de respuesta | Tiempo transcurrido entre radicación y cierre | §8.5, §8.7 |
| 7 | Fecha de radicación | Fecha en que se registró la PQRS | §8.6 |
| 8 | Clasificación de la PQRS | Clasificación adicional de la solicitud | §8.5, §8.6 |

### Variables potencialmente disponibles

| # | Variable | Descripción | Condición |
|---|----------|-------------|-----------|
| 9 | Descripción textual | Texto libre con el detalle de la inconformidad | Si el dataset la contiene |
| 10 | Identificador anónimo | Código único de la PQRS (sin datos personales) | Si el dataset la contiene |
| 11 | Edad del paciente | Rango de edad (sin identificación personal) | Si el dataset la contiene |
| 12 | Género | Sexo del paciente (sin identificación personal) | Si el dataset la contiene |

---

## Diccionario de datos — Dataset real

> Actualizado a partir de `ProyectoDocumento/BASE.xlsx` (2,252 registros × 31 columnas originales).
> El dataset analítico resultante (`data/processed/pqrs_analitico_v2.csv`) tiene 26 columnas tras anonimización, limpieza completa (dedup, imputación por moda, winsorización) y transformación.

### Mapeo de variables originales → analíticas

| # | Variable analítica | Columna analítica | Columna original | Tipo | Nulos | Rol |
|---|--------------------|--------------------|-------------------|------|-------|-----|
| 1 | Fecha de reporte | `fecha_reporte` | Fecha del Reporte | Datetime | 0 | Descriptivo |
| 2 | Mes | `mes` | Mes | Categórica | 0 | Descriptivo |
| 3 | Mes numérico | `mes_num` | (derivada) | Numérica | 0 | Derivada |
| 4 | Semana ISO | `semana` | (derivada) | Numérica | 0 | Derivada |
| 5 | Fecha de cierre | `fecha_cierre` | Fecha de Cierre | Datetime | 0 | Descriptivo |
| 6 | Tiempo de respuesta | `dias_respuesta` | (derivada) | Numérica | 0 | Descriptivo + Clustering |
| 7 | Estado | `estado` | Estado | Categórica | 0 | Descriptivo |
| 8 | Tipo de PQRS | `tipo_pqrs` | Tipo de Solicitud | Categórica | 0 | Descriptivo + Clustering |
| 9 | Grupo de tipo | `tipo_pqrs_grupo` | (derivada) | Categórica | 0 | Derivada |
| 10 | Causa | `causa` | Clasificación | Categórica | 0 | Descriptivo + Clustering |
| 11 | Canal de ingreso | `canal` | Medio de Transmisión | Categórica | 0 | Descriptivo + Clustering |
| 12 | Área de solicitud | `area_solicitud` | Área de Solicitud | Categórica | 0 | Descriptivo |
| 13 | Servicio/Programa | `programa` | Programa | Categórica | 25 (1.1%) | Descriptivo + Clustering |
| 14 | Ámbito | `ambito` | Ámbito | Categórica | 5 (0.2%) | Descriptivo |
| 15 | Tipo de usuario | `tipo_usuario` | Tipo de Usuario | Categórica | 0 | Descriptivo |
| 16 | Aseguradora | `aseguradora` | Aseguradora | Categórica | 68 (3.0%) | Descriptivo |
| 17 | Regional | `regional` | Regional | Categórica | 7 (0.3%) | Descriptivo |
| 18 | Sede | `sede` | Sede | Categórica | 7 (0.3%) | Descriptivo |
| 19 | Vencimiento | `vencimiento` | Vencimiento | Categórica | 0 | Descriptivo |
| 20 | Tiene texto | `tiene_texto` | (derivada de Hechos) | Booleana | 0 | Textual |
| 21 | Longitud texto | `len_texto` | (derivada de Hechos) | Numérica | 0 | Textual |
| 22 | Texto hechos | `Hechos` | Hechos | Texto | 0 | Textual (NLP) |
| 23 | Texto respuesta | `Respuesta` | Respuesta | Texto | 0 | Textual (NLP) |
| 24 | Respuesta involucrados | `Respuesta de Involucrados` | Respuesta de Involucrados | Texto | 334 (14.8%) | Textual (NLP) |

### Columnas eliminadas (anonimización)

| Columna original | Motivo |
|------------------|--------|
| Login | Datos personales de empleados |
| Reporta | Nombre de la persona que reporta |
| Correo | Correos electrónicos |
| Identificación del Paciente | Documentos de identidad (dato sensible) |
| Nombre del Paciente | Nombres de pacientes (dato sensible) |
| Guardián | Nombres de personal |
| Involucrados | Nombres de implicados |
| Archivos de PQRS | Nombres de archivos con datos personales |
| ID, Código | Identificadores internos secuenciales sin valor analítico |
| Servicios | Columna de prueba ("SIN SERVICIOS" / "PRUEBA DE TIPO") |
| Descripción | Redundante con Hechos, textos cortos |

### Catálogos reales de las variables clave

#### tipo_pqrs (Tipo de Solicitud)

| Valor | Frecuencia | % |
|-------|-----------|-----|
| RECLAMO RIESGO SIMPLE | 849 | 37.6% |
| RECLAMO RIESGO PRIORIZADO | 832 | 36.8% |
| PETICIÓN | 272 | 12.0% |
| FELICITACIÓN | 268 | 11.9% |
| QUEJA | 37 | 1.6% |
| RECLAMO RIESGO VITAL | 3 | 0.1% |

#### causa (Clasificación — Circular 017/2020)

| Valor | Frecuencia | % |
|-------|-----------|-----|
| OPORTUNIDAD | — | — |
| CONTINUIDAD | — | — |
| ACCESIBILIDAD | — | — |
| PERTINENCIA | — | — |
| SEGURIDAD | — | — |
| NO APLICA | — | — |

#### canal (Medio de Transmisión)

| Valor | Frecuencia | % |
|-------|-----------|-----|
| CORREO ELECTRONICO | — | — |
| PÁGINA WEB | — | — |
| BUZON DE SUGERENCIAS | — | — |
| PRESENCIAL | — | — |
| CALLCENTER | — | — |
| PCR SANITAS | — | — |

#### programa (Servicio)

| Valor | Frecuencia |
|-------|-----------|
| NO VENTILADO | 797 |
| UNIDAD DE REHABILITACIÓN | 392 |
| PUNTUAL | 321 |
| APLICACIÓN DE MEDICAMENTO | 317 |
| UNIDAD DE SALUD MENTAL | 176 |
| UNIDAD DE CUIDADO CRÓNICO | 91 |
| HOSPITALIZACIÓN GENERAL | 53 |
| VENTILADO | 50 |
| DOMICILIARIO | 19 |
| Otros | — |

> Frecuencias de causa, canal y demás se completan en el EDA (ver resultados JSON).

## Proceso de construcción del diccionario

Cuando se reciba el dataset real, se ejecutará el siguiente proceso:

```
1. Carga del dataset
       ↓
2. Inspección de columnas (names, dtypes, shape)
       ↓
3. Profiling automatizado (ydata-profiling o similar)
       ↓
4. Análisis de nulos por columna
       ↓
5. Análisis de valores únicos por columna categórica
       ↓
6. Estadísticas descriptivas por columna numérica
       ↓
7. Detección de duplicados
       ↓
8. Actualización de este diccionario con datos reales
       ↓
9. Validación con el equipo académico
```

---

## Consideraciones de privacidad

- El dataset **no debe contener** nombres, cédulas, direcciones ni teléfonos de pacientes.
- Si el dataset original contiene datos personales, se debe crear una versión **anonimizada** antes del análisis.
- Los identificadores de PQRS se mantienen como referencia interna, no se exponen en la interfaz.
- Se cumple con la Ley 1581 de 2012 sobre protección de datos personales.
- Los datos sensibles de salud se tratan con las precauciones adicionales que establece la normativa.

