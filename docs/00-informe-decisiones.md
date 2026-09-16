# 00 — Informe de Decisiones, Pendientes y Riesgos

## Estado

Documento generado en la transición entre la FASE 5 (documentación) y la FASE 6 (implementación), que resume las decisiones tomadas y los aspectos pendientes tras conocer el dataset real.

---

## Decisiones tomadas

| # | Decisión | Justificación |
|---|----------|---------------|
| D1 | **Se utiliza Python como capa analítica** (en lugar de Excel + Power BI del documento académico) | Python permite pipeline reproducible, trazable y automatizable. El documento académico recomienda Python para el análisis (Pandas, NumPy, Matplotlib, Seaborn). |
| D2 | **Se construye una API FastAPI para exponer resultados** | Separa el análisis de la presentación, permite que Angular consuma datos validados y documentados (Swagger). No contradice el documento: lo complementa como infraestructura de visualización. |
| D3 | **Se utiliza Angular + ECharts como dashboard** (en lugar de Power BI) | Power BI exige licencia y su diseño es limitado. Angular + ECharts ofrece control total, gratuidad y una experiencia web interactiva de BI. |
| D4 | **El dataset real es BASE.xlsx (2,261 registros × 31 columnas)** | Confirmado en `ProyectoDocumento/BASE.xlsx`. Se trabajará con censo completo. |
| D5 | **Anonimización de datos personales antes del análisis** | El dataset contiene: Identificación del Paciente, Nombre del Paciente, Correo, Login, Involucrados. Se eliminan/anonimizan según Ley 1581/2012. |
| D6 | **Las columnas de texto (Hechos, Descripción) habilitan el análisis textual** | Existen descripciones textuales en el dataset → el análisis NLP (FASE 10 de docs) es viable y se ejecutará con spaCy. |
| D7 | **La columna "Mes" ya existe en el dataset** | Facilita el análisis temporal por mes. Se validará su consistencia con "Fecha del Reporte". |
| D8 | **El dataset permanece en `ProyectoDocumento/` como fuente oficial** | No se copia a `data/raw/` para evitar duplicación; se referencia desde allí en el código de carga. |
| D9 | **Segmentación con K-Modes o K-Prototypes** | Según el tipo de variables finales (predominantemente categóricas). Se evaluará tras el EDA. |
| D10 | **Nunca modificar BASE.xlsx** | Se generan datasets derivados en `data/processed/`. |
| D11 | **Eliminación de registros duplicados (9)** | 9 registros idénticos en todas las columnas no textuales → dataset analítico de 2,252 (2,261 − 9). Se conserva el primer registro. |
| D12 | **Imputación de nulos categóricos con la moda** | `programa` (25), `ambito` (5), `aseguradora` (68), `regional` (7), `sede` (7). La moda es estable en estas columnas (NO VENTILADO, EPS SANITAS, MONTEVIDEO, BOGOTÁ) y no introduce sesgo relevante. Textos (Respuesta de Involucrados: 325) se rellenan con `""` para NLP. |
| D13 | **Winsorización de outliers en dias_respuesta (techo Q3 + 3·IQR ≈ 29 días)** | P75=8, IQR=7 → techo 29 días. 150 registros >29 días (máx. 263) se truncaron para no inflar la media (8.7 → 6.7 días). Valores originales en `dias_respuesta_original` + flag `es_outlier_respuesta` para trazabilidad. |
| D14 | **Unificación de categorías con errores de tilde** | `CUCUTA` → `CÚCUTA` (1 registro). Categorías de cola minoritarias (aseguradoras, sedes) se conservan por ser catálogos legítimos. |
| D15 | **Reducción de `BASE.xlsx` de 14 a 12 columnas** | Se eliminan `Código` (identificador interno, único por fila, sin valor analítico) y `Estado` (1 solo valor: "CERRADA", varianza cero). Esto revierte parcialmente D10 (nunca modificar BASE.xlsx): la fuente oficial se sobrescribe con el esquema reducido. Consecuencia: `causa`, `programa` y `sede` (provenientes de `Clasificación`, `Programa` y `Sede`) dejan de generarse; `clustering.py` y los JSON del backend se reconfiguraron con las variables disponibles (D16 → cierra P6). |
| D16 | **Reconfiguración del análisis/dashboard con las variables disponibles tras D15** | `causa` → **`ambito`** (4 categorías: PAD AGUDO/PAD CRÓNICO/AMBULATORIO/HOSPITALIZACIÓN) y `programa` → **`area_solicitud`** (30 categorías) como nuevas dimensiones centrales de dashboard, filtros, insights y segmentación. Se actualizan: `eda.py` (CATEGORICAS, resumen `ambito_mas_frecuente`/`area_mas_frecuente`, 12 cruces canónicos, temporal sin `por_programa_mes`, insights en ámbito/área), `clustering.py` (cat_vars: `tipo_pqrs_grupo, canal, area_solicitud, ambito` + `dias_respuesta`), `filtros.py` (claves `ambitos`/`areas`), frontend (página Causas→Ámbito, Servicios→Áreas de solicitud, filtros renombrados, KPIs/templates) y tests (`total_pqrs=2251`). Se elimina el tipo `TemporalMesPrograma`/`filtrarTemporal` (sin uso). |

---

## Pendientes

| # | Pendiente | Estado | Responsable |
|---|-----------|--------|-------------|
| P1 | Confirmar la interpretación de cada una de las 31 columnas con HeLi Salud IPS | [ ] | Equipo |
| P2 | Verificar si "Fecha del Hecho" y "Fecha de Cierre" permiten calcular tiempo de respuesta real | [ ] | Equipo |
| P3 | Confirmar qué constituye "tiempo de respuesta" (¿Fecha de Cierre - Fecha del Reporte?) | [ ] | Equipo |
| P4 | Validar la clasificación de columnas textuales (Guardían, Respuesta, Involucrados) | [ ] | Equipo |
| P5 | Decidir tratamiento de nulos tras el perfilamiento | [x] | Equipo |
| P6 | Reconfigurar clustering.py y JSON del backend tras retirar causa/programa/sede (D15) | [x] | Equipo |

---

## Riesgos

| # | Riesgo | Impacto | Mitigación |
|---|--------|---------|-----------|
| R1 | Alto porcentaje de nulos en columnas clave (causa, servicio, tipo) | Alto | Perfilamiento detallado antes del análisis |
| R2 | Columnas con catálogos diferentes a los esperados (Tipo de Solicitud vs. Clasificación) | Medio | Documentar y estandarizar categorías |
| R3 | Tiempo de respuesta no calculable si faltan fechas de cierre | Alto | Evaluar variables proxy |
| R4 | Datos personales expuestos accidentalmente | Alto | Anonimización estricta: eliminar Identificación, Nombre, Correo, Login, Involucrados |
| R5 | Alta cardinalidad en columnas de texto (Hechos, Descripción) | Medio | NLP con límites de volumen y agrupación de temas |
| R6 | Inconsistencia entre columna "Mes" y "Fecha del Reporte" | Medio | Validación cruzada de fechas |

---

## Supuestos

| # | Supuesto |
|---|----------|
| S1 | La fila 1 del Excel es el encabezado y las filas 2-2253 son los 2,252 registros (tras deduplicar) |
| S2 | "Medio de Transmisión" es el canal de ingreso de la PQRS |
| S3 | "Tipo de Solicitud" corresponde al tipo de PQRS (petición, queja, reclamo, sugerencia) |
| S4 | "Servicios" es la variable de servicio asociado |
| S5 | "Clasificación" sigue el catálogo de la Circular 017 de 2020 |
| S6 | El análisis se realiza sobre el censo completo sin muestreo |

---

## Preguntas que necesitan validación

1. ¿"Tipo de Solicitud" es el tipo de PQRS o existe otra columna?
2. ¿"Servicios" contiene lista de servicios (varios, separados) o un solo servicio?
3. ¿"Área de Solicitud" coincide con "Servicios" o es un área administrativa?
4. ¿La variable "Tiempo de respuesta" corresponde a (Fecha de Cierre − Fecha del Reporte)?
5. ¿"Ámbito", "Programa" y "Aseguradora" son variables relevantes para el análisis o información operativa?
6. ¿Cuántas PQRS tienen fecha de cierre válida (para calcular tiempo de respuesta)?
7. ¿Hay alguna columna que agrupe las causas de inconformidad? (p.ej. "Clasificación")
8. ¿"Estado" tiene cuántos valores distintos?