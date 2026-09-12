# 15 — Plan de Implementación

## Visión general

El proyecto se desarrolla en 10 fases secuenciales. Cada fase tiene un objetivo claro, actividades definidas y criterios de salida.

---

## Roadmap

```
FASE 0 ── Comprensión
  │         ✓ Leer documento académico
  │         ✓ Identificar problema y objetivos
  │         ✓ Entender contexto institucional
  │
FASE 1 ── Documentación
  │         ✓ Crear 17 documentos de docs/
  │         ✓ Definir arquitectura
  │         ✓ Definir pipeline
  │         ✓ Definir metodología analítica
  │
FASE 2 ── Revisión y aprobación
  │         ✓ Revisar documentación completa
  │         ✓ Identificar decisiones pendientes
  │         ✓ Validar con datos reales (si disponibles)
  │         ✓ Aprobación para continuar
  │
FASE 3 ── Preparación de datos
  │         ✓ Recibir dataset real
  │         ✓ Cargar y perfilar
  │         ✓ Limpiar y estandarizar
  │         ✓ Construir diccionario de datos real
  │         ✓ Generar dataset analítico
  │
FASE 4 ── Análisis exploratorio (EDA)
  │         ✓ Distribuciones individuales
  │         ✓ Cruces de variables
  │         ✓ Análisis temporal
  │         ✓ Estadísticas descriptivas
  │         ✓ Generar resultados JSON
  │
FASE 5 ── Clustering / Segmentación
  │         ✓ Selección de variables
  │         ✓ Selección de algoritmo
  │         ✓ Determinación de k
  │         ✓ Entrenamiento
  │         ✓ Validación
  │         ✓ Interpretación de clusters
  │
FASE 6 ── API (FastAPI)
  │         ✓ Configurar FastAPI
  │         ✓ Crear modelos Pydantic
  │         ✓ Implementar endpoints
  │         ✓ Cargar datos JSON
  │         ✓ Documentación Swagger
  │         ✓ Tests básicos
  │
FASE 7 ── Frontend (Angular)
  │         ✓ Crear proyecto Angular
  │         ✓ Configurar Tailwind CSS
  │         ✓ Configurar ECharts
  │         ✓ Crear componentes compartidos
  │         ✓ Crear páginas
  │         ✓ Consumir API
  │         ✓ Diseño responsive
  │
FASE 8 ── Integración
  │         ✓ Conectar Angular + FastAPI
  │         ✓ Probar filtros
  │         ✓ Probar todas las páginas
  │         ✓ Probar responsive
  │         ✓ Ajustes de diseño
  │
FASE 9 ── Validación
  │         ✓ Verificar resultados contra análisis
  │         ✓ Verificar cálculos
  │         ✓ Verificar filtros
  │         ✓ Verificar visualizaciones
  │         ✓ Verificar API
  │         ✓ Verificar errores y rendimiento
  │
FASE 10 ── Documentación final
            ✓ Actualizar docs con resultados reales
            ✓ Actualizar diccionario de datos
            ✓ Documentar decisiones tomadas
            ✓ Preparar para sustentación
```

---

## Detalle por fase

### FASE 0: Comprensión

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 0.5 días |
| Entregable | Comprensión completa del proyecto |
| Dependencias | Ninguna |
| Criterio de salida | Se entiende el problema, objetivos, contexto y alcance |

**Actividades:**
- Leer documento académico completo
- Identificar variables del dataset
- Entender metodología propuesta
- Identificar herramientas del documento

---

### FASE 1: Documentación

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 2-3 días |
| Entregable | 17 documentos en `docs/` |
| Dependencias | FASE 0 |
| Criterio de salida | Todos los documentos creados con contenido completo |

**Actividades:**
- Crear estructura de carpetas
- Redactar los 17 documentos
- Documentar arquitectura, pipeline, metodología

---

### FASE 2: Revisión y aprobación

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 1 día |
| Entregable | Informe de decisiones pendientes |
| Dependencias | FASE 1 |
| Criterio de salida | Aprobación para proceder con implementación |

**Actividades:**
- Revisar cada documento
- Identificar inconsistencias
- Listar decisiones pendientes
- Validar con el equipo académico
- Obtener aprobación

---

### FASE 3: Preparación de datos

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 2-3 días |
| Entregable | Dataset analítico limpio + diccionario actualizado |
| Dependencias | FASE 2 + dataset real |
| Criterio de salida | Dataset limpio, validado y documentado |

**Actividades:**
- Recibir dataset real de HeLi Salud IPS
- Cargar en Python (Pandas)
- Perfilar automáticamente
- Limpiar (duplicados, nulos, tipos)
- Estandarizar categorías
- Crear variables derivadas
- Actualizar diccionario de datos con columnas reales
- Exportar a `data/processed/`

**Herramientas:** Python, Pandas, ydata-profiling

---

### FASE 4: Análisis exploratorio (EDA)

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 3-4 días |
| Entregable | Notebook de EDA + resultados JSON |
| Dependencias | FASE 3 |
| Criterio de salida | Análisis completo con distribuciones, cruces y visualizaciones |

**Actividades:**
- Distribuciones de todas las variables
- Cruces relevantes de variables
- Análisis temporal
- Estadísticas de tiempo de respuesta
- Generar gráficos exploratorios
- Exportar resultados a JSON

**Herramientas:** Python, Pandas, Matplotlib, Seaborn, Jupyter Notebook

---

### FASE 5: Clustering / Segmentación

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 2-3 días |
| Entregable | Notebook de clustering + resultados JSON |
| Dependencias | FASE 4 |
| Criterio de salida | Clusters identificados, validados e interpretados |

**Actividades:**
- Seleccionar variables para clustering
- Evaluar K-Modes vs K-Prototypes vs MCA+K-Means
- Determinar número de clusters (codo, silueta)
- Entrenar modelo
- Validar calidad
- Interpretar cada cluster
- Asignar nombre descriptivo
- Exportar resultados a JSON

**Herramientas:** Python, kmodes, Scikit-learn

---

### FASE 6: API (FastAPI)

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 2-3 días |
| Entregable | API funcional con todos los endpoints |
| Dependencias | FASE 4 + FASE 5 (resultados JSON) |
| Criterio de salida | API consumible desde el frontend, documentada en Swagger |

**Actividades:**
- Configurar proyecto FastAPI
- Crear modelos Pydantic
- Implementar endpoints: resumen, distribuciones, cruces, clusters, insights, textual, filtros
- Cargar datos JSON
- Configurar CORS
- Tests básicos
- Documentación Swagger

**Herramientas:** Python, FastAPI, Pydantic, Uvicorn

---

### FASE 7: Frontend (Angular)

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 4-6 días |
| Entregable | Aplicación Angular completa |
| Dependencias | FASE 6 (API funcional) |
| Criterio de salida | Todas las páginas funcionales, responsive, consumiendo la API |

**Actividades:**
- Crear proyecto Angular 17+
- Configurar Tailwind CSS
- Configurar Apache ECharts (ngx-echarts)
- Crear estructura de carpetas
- Crear componentes compartidos (sidebar, KPI card, filter bar, etc.)
- Crear páginas: Dashboard, Tendencias, Causas, Servicios, Segmentación, Textual, Insights
- Crear servicios (ApiService, FilterService)
- Implementar filtros interactivos
- Consumir API
- Diseño responsive
- Estados de carga y vacíos

**Herramientas:** Angular, TypeScript, Tailwind CSS, ECharts

---

### FASE 8: Integración

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 1-2 días |
| Entregable | Sistema integrado funcionando |
| Dependencias | FASE 6 + FASE 7 |
| Criterio de salida | Angular consume FastAPI correctamente, todas las páginas funcionan |

**Actividades:**
- Verificar conexión Angular ↔ FastAPI
- Probar todos los filtros
- Probar todas las páginas
- Probar responsive en diferentes breakpoints
- Ajustes de diseño y UX
- Corregir errores de integración

---

### FASE 9: Validación

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 1-2 días |
| Entregable | Informe de validación |
| Dependencias | FASE 8 |
| Criterio de salida | Todo verificado, sin errores críticos |

**Actividades:**
- Verificar que los KPIs del dashboard coinciden con los datos reales
- Verificar cálculos de distribuciones
- Verificar que los filtros funcionan correctamente
- Verificar que los gráficos muestran datos correctos
- Verificar que la segmentación se muestra correctamente
- Verificar la API (endpoints, respuestas, errores)
- Verificar rendimiento
- Verificar responsive
- Verificar accesibilidad básica

---

### FASE 10: Documentación final

| Aspecto | Detalle |
|---------|---------|
| Duración estimada | 1 día |
| Entregable | Documentación actualizada con resultados reales |
| Dependencias | FASE 9 |
| Criterio de salida | Documentación lista para sustentación |

**Actividades:**
- Actualizar `docs/04-datos-y-diccionario.md` con columnas reales
- Actualizar `docs/08-analisis-descriptivo.md` con hallazgos reales
- Actualizar `docs/09-segmentacion.md` con resultados reales
- Actualizar `docs/14-insights-y-recomendaciones.md` con insights reales
- Actualizar README.md
- Preparar resumen para sustentación

---

## Resumen de cronograma

| Fase | Nombre | Duración estimada | Dependencias |
|------|--------|-------------------|--------------|
| 0 | Comprensión | 0.5 días | — |
| 1 | Documentación | 2-3 días | FASE 0 |
| 2 | Revisión | 1 día | FASE 1 |
| 3 | Preparación datos | 2-3 días | FASE 2 + dataset |
| 4 | EDA | 3-4 días | FASE 3 |
| 5 | Clustering | 2-3 días | FASE 4 |
| 6 | API | 2-3 días | FASE 4 + 5 |
| 7 | Frontend | 4-6 días | FASE 6 |
| 8 | Integración | 1-2 días | FASE 6 + 7 |
| 9 | Validación | 1-2 días | FASE 8 |
| 10 | Docs finales | 1 día | FASE 9 |
| **Total** | | **~19-28 días** | |

---

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| El dataset no contiene todas las variables esperadas | Media | Alto | Documentar qué variables faltan y ajustar análisis |
| El dataset tiene muchos nulos | Media | Medio | Definir estrategia de imputación o exclusión |
| Variables con alta cardinalidad | Media | Medio | Agrupar categorías poco frecuentes |
| El clustering no genera clusters interpretables | Baja | Alto | Evaluar diferentes algoritmos y número de k |
| El tiempo de desarrollo excede el cronograma | Media | Medio | Priorizar funcionalidades core |
| Problemas de compatibilidad Angular + ECharts | Baja | Medio | Usar versiones estables y documentadas |
