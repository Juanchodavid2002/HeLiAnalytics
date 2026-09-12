# 01 — Visión Técnica del Sistema

## Nombre del sistema

**HeLi Analytics — Centro de Inteligencia de PQRS**

## Propósito

HeLi Analytics es una plataforma de Business Intelligence / Data Analytics diseñada para transformar los resultados del análisis de PQRS de HeLi Salud IPS en información visual, interactiva y accionable.

El sistema NO modifica los datos originales. Su función exclusiva es:

- Visualizar resultados del análisis descriptivo.
- Explorar patrones de segmentación (clustering).
- Facilitar la identificación de causas críticas y oportunidades de mejora.
- Expolar insights derivados del análisis de datos.

## Contexto

| Aspecto | Detalle |
|---------|---------|
| Institución | HeLi Salud IPS |
| Sector | Salud mental |
| Ubicación | Colombia |
| Población | ~2,252 registros de PQRS |
| Periodo | Segundo semestre de 2025 |
| Tipo de análisis | Descriptivo-analítico con segmentación |

## Arquitectura de alto nivel

El sistema se estructura en tres capas principales:

```
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE ANÁLISIS                     │
│                                                         │
│  Python 3.x · Pandas · NumPy · Scikit-learn · kmodes   │
│  Matplotlib · Seaborn · Jupyter Notebook                │
│                                                         │
│  Funciones:                                             │
│  - Carga y depuración de datos                         │
│  - Análisis exploratorio (EDA)                          │
│  - Estadística descriptiva                              │
│  - Clustering / Segmentación                            │
│  - Análisis textual (NLP)                               │
│  - Generación de resultados exportables                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE API                          │
│                                                         │
│  Python · FastAPI · Pydantic                            │
│                                                         │
│  Funciones:                                             │
│  - Exponer resultados analíticos como JSON              │
│  - Endpoints para dashboard, filtros, segmentación      │
│  - Validación de contratos de datos                     │
│  - Consumo eficiente por el frontend                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                 │
│                                                         │
│  Angular · TypeScript · Tailwind CSS · Apache ECharts   │
│                                                         │
│  Funciones:                                             │
│  - Dashboard interactivo de BI                          │
│  - Visualizaciones gráficas interactivas                │
│  - Filtros dinámicos                                    │
│  - Páginas: Resumen, Tendencias, Causas, Servicios,    │
│    Segmentación, Análisis textual, Insights             │
│  - Diseño responsive y profesional                      │
└─────────────────────────────────────────────────────────┘
```

## Principios fundamentales

1. **No modificación de datos originales**: Los datos crudos nunca se alteran. Se generan datasets derivados para análisis.
2. **Reproducibilidad**: Cada paso del análisis debe ser reproducible por una persona externa.
3. **Trazabilidad**: Desde los datos crudos hasta los resultados visualizados, cada transformación debe quedar documentada.
4. **Privacidad**: No se exponen datos personales identificables. Los datos se anonimizan cuando es necesario.
5. **Justificación técnica**: Cada decisión tecnológica debe poder defenderse académicamente.

## Justificación de la arquitectura

### Por qué Python como core analítico

- Python es el estándar de la industria para análisis de datos y ciencia de datos.
- Bibliotecas como Pandas, NumPy, Scikit-learn y kmodes ofrecen funcionalidades robustas para EDA, estadística y clustering.
- Jupyter Notebook permite documentar el proceso analítico de forma reproducible.
- El documento académico del proyecto recomienda expresamente Python, Pandas, NumPy, Matplotlib y Seaborn.

### Por qué FastAPI como backend

- FastAPI genera automáticamente documentación interactiva (Swagger/OpenAPI).
- Rendimiento alto grâce a la asincronía nativa.
- Pydantic proporciona validación estricta de tipos.
- Permite exponer los resultados del análisis Python sin necesidad de reimplementar lógica.
- Separación clara entre análisis y presentación.

### Por qué Angular como frontend

- Angular Standalone Components permite arquitectura modular sin NgModules.
- TypeScript proporciona tipado fuerte, reduciendo errores en runtime.
- Tailwind CSS facilita un diseño profesional y responsive.
- Apache ECharts permite gráficos interactivos de alto rendimiento para datos analíticos.
- Angular es adecuado para aplicaciones de tipo dashboard/BI con múltiples vistas.

### Comparación con las herramientas del documento académico

| Documento académico | HeLi Analytics | Justificación del cambio |
|--------------------|----------------|--------------------------|
| Microsoft Excel | Python + Pandas | Escalabilidad, automatización, reproducibilidad |
| Power BI | Angular + ECharts | Control total del diseño, integración con API, apertura académica |
| Python (análisis) | Python (análisis) | Coincide — se mantiene |

> El documento académico menciona Excel y Power BI como herramientas. HeLi Analytics reemplaza estas herramientas con una solución más robusta y reproducible, manteniendo Python como base analítica. Esto se justifica por la necesidad de un pipeline automatizado, trazable y desplegable como aplicación web.

## Alcance del sistema

### Lo que SÍ incluye

- Análisis descriptivo completo de PQRS
- Segmentación/clustering de registros
- Dashboard interactivo con visualizaciones
- Filtros por período, servicio, tipo, causa, canal, cluster
- Página de insights basados en datos reales
- Análisis textual (si el dataset contiene descripciones)

### Lo que NO incluye

- Modificación de datos originales
- Predicciones o modelos predictivos (salvo simulación hipotética marcada como tal)
- Gestión operativa de PQRS (no es un sistema CRUD)
- Conexión en tiempo real con sistemas de HeLi Salud IPS
- Almacenamiento de datos personales identificables
