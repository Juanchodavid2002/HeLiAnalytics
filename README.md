# HeLi Analytics

**Centro de Inteligencia de PQRS — HeLi Salud IPS**

Plataforma de Business Intelligence / Data Analytics para el análisis descriptivo y segmentación de las PQRS de pacientes de salud mental de HeLi Salud IPS en Colombia.

---

## Contexto del proyecto

| Aspecto | Detalle |
|---------|---------|
| Institución | HeLi Salud IPS |
| Sector | Salud mental |
| Periodo | Segundo semestre de 2025 |
| Población | ~2,252 registros de PQRS |
| Tipo de análisis | Descriptivo-analítico con segmentación |

## Objetivo

Identificar patrones en las PQRS radicadas por pacientes de salud mental de HeLi Salud IPS, que permitan reconocer oportunidades de mejora en la atención, a partir de los datos del segundo semestre de 2025.

## Arquitectura

```
Datos crudos (Excel/CSV)
        ↓
Python (Pandas, NumPy, Scikit-learn, kmodes)
        ↓
FastAPI (API REST)
        ↓
Angular + Tailwind CSS + ECharts
        ↓
HeLi Analytics — Dashboard interactivo
```

## Estructura del proyecto

```
heli-analytics/
├── docs/                    # Documentación completa (17 documentos)
├── data/
│   ├── raw/                 # Datos originales (NO modificar)
│   └── processed/           # Datos derivados del análisis
├── analysis/
│   ├── notebooks/           # Notebooks Jupyter reproducibles
│   └── src/                 # Módulos Python reutilizables
├── backend/
│   ├── app/                 # FastAPI
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   └── angular-app/         # Angular 17+
├── scripts/                 # Scripts auxiliares
├── .gitignore
└── LICENSE
```

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Análisis | Python, Pandas, NumPy, Scikit-learn, kmodes |
| Visualización (análisis) | Matplotlib, Seaborn |
| Backend/API | FastAPI, Pydantic |
| Frontend | Angular 17+, TypeScript, Tailwind CSS, Apache ECharts |
| Control de versiones | Git, GitHub |

## Documentación

La carpeta `docs/` contiene 17 documentos que cubren:

| Doc | Contenido |
|-----|-----------|
| 01 | Visión técnica del sistema |
| 02 | Problema y objetivos |
| 03 | Requerimientos |
| 04 | Datos y diccionario |
| 05 | Metodología analítica |
| 06 | Arquitectura |
| 07 | Pipeline de datos |
| 08 | Análisis descriptivo (EDA) |
| 09 | Segmentación (Clustering) |
| 10 | Análisis textual |
| 11 | API (FastAPI) |
| 12 | Frontend (Angular) |
| 13 | Dashboard |
| 14 | Insights y recomendaciones |
| 15 | Plan de implementación |
| 16 | Validación |
| 17 | Reproducibilidad |

## Equipo académico

**Presentado por:**
- Michell Dayana Carrillo
- Luis Castelblanco
- David Sanchez

**Dirección:**
- Andrés Felipe Valencia Vidal — Magíster en Sistemas Energéticos

**Programa:** Especialización en Analítica de Datos

## Licencia

Este proyecto es de uso académico.
