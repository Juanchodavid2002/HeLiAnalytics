# 06 — Arquitectura del Sistema

## Diagrama de arquitectura

```
                    ┌──────────────────────┐
                    │    DATOS ORIGINALES   │
                    │    (Excel / CSV)      │
                    └──────────┬───────────┘
                               │
                               ▼
                ┌──────────────────────────┐
                │                          │
                │     CAPA DE ANÁLISIS     │
                │                          │
                │  ┌────────────────────┐  │
                │  │   Python 3.x       │  │
                │  │                    │  │
                │  │  Pandas            │  │
                │  │  NumPy             │  │
                │  │  Scikit-learn      │  │
                │  │  kmodes            │  │
                │  │  Matplotlib        │  │
                │  │  Seaborn           │  │
                │  │  spaCy (opcional)  │  │
                │  └────────────────────┘  │
                │                          │
                │  Funciones:              │
                │  • Carga y validación    │
                │  • Depuración            │
                │  • EDA                   │
                │  • Estadística           │
                │  • Clustering            │
                │  • NLP                   │
                │  • Exportación JSON      │
                │                          │
                └────────────┬─────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
          ┌─────────────┐   ┌──────────────┐
          │  Notebooks   │   │  Resultados  │
          │  (.ipynb)    │   │  (.json)     │
          │              │   │              │
          │  Análisis    │   │  • resumen   │
          │  reproducible│   │  • distrib.  │
          └─────────────┘   │  • clusters  │
                            │  • insights  │
                            │  • textual   │
                            └──────┬───────┘
                                   │
                                   ▼
                ┌──────────────────────────┐
                │                          │
                │       CAPA DE API        │
                │                          │
                │  ┌────────────────────┐  │
                │  │     FastAPI        │  │
                │  │                    │  │
                │  │  Pydantic Models   │  │
                │  │  Endpoints REST    │  │
                │  │  OpenAPI/Swagger   │  │
                │  └────────────────────┘  │
                │                          │
                │  Funciones:              │
                │  • Exponer resultados    │
                │  • Filtrado dinámico     │
                │  • Validación de datos   │
                │  • Documentación API     │
                │                          │
                └────────────┬─────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │                          │
                │    CAPA DE PRESENTACIÓN  │
                │                          │
                │  ┌────────────────────┐  │
                │  │     Angular 17+    │  │
                │  │                    │  │
                │  │  Standalone Comps  │  │
                │  │  TypeScript        │  │
                │  │  Tailwind CSS      │  │
                │  │  Apache ECharts    │  │
                │  └────────────────────┘  │
                │                          │
                │  Funciones:              │
                │  • Dashboard BI          │
                │  • Visualizaciones       │
                │  • Filtros dinámicos     │
                │  • Segmentación visual   │
                │  • Insights              │
                │                          │
                └──────────────────────────┘
```

---

## Descripción de capas

### Capa 1: Análisis de datos

| Aspecto | Detalle |
|---------|---------|
| Tecnología | Python 3.x |
| Bibliotecas | Pandas, NumPy, Scikit-learn, kmodes, Matplotlib, Seaborn |
| Entorno | Jupyter Notebook |
| Entrada | Dataset crudo (CSV/Excel) |
| Salida | Resultados analíticos exportados como JSON |
| Responsabilidad | Todo el procesamiento, limpieza, EDA, clustering y generación de resultados |

**Justificación**: Python es el estándar para análisis de datos. Las bibliotecas seleccionadas cubren manipulación, estadística, ML y visualización. Jupyter permite documentar el proceso de forma reproducible.

### Capa 2: API (Backend)

| Aspecto | Detalle |
|---------|---------|
| Tecnología | FastAPI + Pydantic |
| Formato | REST API |
| Documentación | OpenAPI/Swagger (automática) |
| Entrada | Resultados JSON del análisis |
| Salida | Endpoints consumibles por el frontend |
| Responsabilidad | Exponer resultados de forma estructurada y validada |

**Justificación**: FastAPI es moderno, rápido (async), genera documentación automática y utiliza Pydantic para validación estricta. Permite separar el análisis de la presentación.

### Capa 3: Presentación (Frontend)

| Aspecto | Detalle |
|---------|---------|
| Tecnología | Angular 17+ |
| Componentes | Standalone Components |
| Estilos | Tailwind CSS |
| Gráficos | Apache ECharts |
| Tipado | TypeScript |
| Entrada | Datos JSON de la API |
| Salida | Interfaz web interactiva de BI |
| Responsabilidad | Visualización, exploración e interacción con los datos |

**Justificación**: Angular ofrece tipado fuerte, modularidad con standalone components y ecosistema robusto. Tailwind CSS permite diseño profesional y responsive. ECharts proporciona gráficos interactivos de alto rendimiento para datos analíticos.

---

## Flujo de datos completo

```
1. Dataset crudo (CSV/Excel) en data/raw/
        ↓
2. Python carga y valida el dataset
        ↓
3. Depuración y limpieza → data/processed/
        ↓
4. EDA en Jupyter Notebook → analysis/notebooks/
        ↓
5. Estadística descriptiva → resultados JSON
        ↓
6. Clustering / Segmentación → resultados JSON
        ↓
7. Análisis textual (si aplica) → resultados JSON
        ↓
8. Exportación consolidada a backend/app/data/
        ↓
9. FastAPI expone endpoints → JSON en memoria/cache
        ↓
10. Angular consume API → Dashboard interactivo
```

---

## Decisiones arquitectónicas

| Decisión | Alternativa descartada | Justificación |
|----------|----------------------|---------------|
| Python para análisis | R, Excel | Python es más versátil, tiene mejor ecosistema ML, y el documento lo recomienda |
| FastAPI como API | Flask, Django REST | FastAPI es más rápido, genera docs automáticas, tipado con Pydantic |
| Angular como frontend | React, Vue | Angular es más estructurado para apps de BI, tipado estricto con TypeScript |
| Tailwind CSS | Bootstrap, Material | Tailwind permite diseño custom sin depender de componentes predefinidos |
| Apache ECharts | Chart.js, D3.js | ECharts tiene mejor rendimiento con datos grandes, más tipos de gráficos para BI |
| JSON como formato | XML, GraphQL | JSON es ligero, nativo en JS, suficiente para el volumen de datos |
| No usar BD | PostgreSQL, MongoDB | No hay necesidad de BD: los datos son un solo dataset estático de 2,252 registros |

---

## Seguridad y privacidad

| Medida | Implementación |
|--------|---------------|
| Sin datos personales | El dataset no contiene nombres, cédulas ni datos identificables |
| Anonimización | Los datos se anonimizan antes de cualquier exposición |
| No autenticación | La aplicación es de uso académico/interno (no requiere login) |
| Separación código-datos | Los datos nunca se suben al repositorio público |
| CORS | Configurado para permitir solo el origen del frontend |

---

## Despliegue

| Componente | Despliegue propuesto |
|-----------|---------------------|
| Análisis | Ejecución local (Jupyter) o Google Colab |
| API | Servidor local (uvicorn) o plataforma cloud |
| Frontend | Servidor local (ng serve) o plataforma cloud |
| Repositorio | GitHub (público o privado, sin datos sensibles) |

> El despliegue definitivo se definirá durante la FASE 7-8 del plan de implementación.
