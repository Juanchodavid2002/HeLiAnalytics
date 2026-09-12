# 11 — API (FastAPI)

## Visión general

La API de HeLi Analytics expone los resultados del análisis de PQRS como endpoints REST, consumibles por la aplicación Angular.

---

## Stack tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | FastAPI | 0.100+ |
| Validación | Pydantic | 2.0+ |
| Servidor | Uvicorn | 0.23+ |
| CORS | fastapi.middleware.cors | — |

---

## Arquitectura de la API

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Punto de entrada, configuración CORS
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── resumen.py       # Endpoint /api/resumen
│   │   ├── distribuciones.py # Endpoints /api/distribuciones/*
│   │   ├── cruces.py        # Endpoints /api/cruces/*
│   │   ├── clusters.py      # Endpoints /api/clusters/*
│   │   ├── insights.py      # Endpoint /api/insights
│   │   ├── textual.py       # Endpoint /api/textual
│   │   └── filtros.py       # Endpoint /api/filtros
│   ├── models/
│   │   ├── __init__.py
│   │   ├── resumen.py       # Modelos Pydantic para resumen
│   │   ├── distribuciones.py
│   │   ├── clusters.py
│   │   └── filtros.py
│   ├── data/
│   │   ├── resumen.json
│   │   ├── distribuciones.json
│   │   ├── cruces.json
│   │   ├── clusters.json
│   │   ├── insights.json
│   │   ├── temporal.json
│   │   └── textual.json
│   └── config.py            # Configuración general
├── tests/
│   ├── __init__.py
│   ├── test_resumen.py
│   ├── test_distribuciones.py
│   └── test_clusters.py
├── requirements.txt
└── README.md
```

---

## Endpoints

### GET /api/resumen

**Descripción**: KPIs generales del dashboard.

**Respuesta:**

```json
{
  "total_pqrs": 2252,
  "periodo": {
    "inicio": "2025-07-01",
    "fin": "2025-12-31"
  },
  "distribucion_tipo": {
    "Queja": 0,
    "Reclamo": 0,
    "Peticion": 0,
    "Sugerencia": 0
  },
  "causa_mas_frecuente": "",
  "canal_mas_utilizado": "",
  "tiempo_promedio_respuesta_dias": 0.0,
  "servicio_mas_pqrs": ""
}
```

### GET /api/distribuciones

**Descripción**: Distribuciones de frecuencias de todas las variables categóricas.

**Query parameters:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `variable` | string | Variable específica (opcional) |

**Respuesta:**

```json
{
  "distribuciones": {
    "tipo_pqrs": {
      "frecuencias": [
        {"categoria": "Queja", "frecuencia": 0, "porcentaje": 0.0}
      ]
    },
    "causa": {
      "frecuencias": [...]
    },
    "canal": {
      "frecuencias": [...]
    },
    "servicio": {
      "frecuencias": [...]
    },
    "estado": {
      "frecuencias": [...]
    }
  }
}
```

### GET /api/distribuciones/temporal

**Descripción**: Distribución temporal de PQRS.

**Respuesta:**

```json
{
  "por_mes": [
    {"mes": "2025-07", "cantidad": 0},
    {"mes": "2025-08", "cantidad": 0}
  ],
  "por_semana": [...],
  "tendencia": "estable|creciente|decreciente"
}
```

### GET /api/cruces

**Descripción**: Resultados de cruces de variables.

**Query parameters:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `variables` | string | Par de variables separado por coma |

**Ejemplo:** `/api/cruces?variables=tipo_pqrs,causa`

**Respuesta:**

```json
{
  "cruce": {
    "variable_x": "tipo_pqrs",
    "variable_y": "causa",
    "tabla": {
      "Queja": {"causa_a": 0, "causa_b": 0},
      "Reclamo": {"causa_a": 0, "causa_b": 0}
    }
  }
}
```

### GET /api/clusters

**Descripción**: Resultados del clustering / segmentación.

**Respuesta:**

```json
{
  "algoritmo": "K-Modes",
  "num_clusters": 0,
  "metricas": {
    "costo_total": 0,
    "silueta": 0.0
  },
  "clusters": [
    {
      "id": 0,
      "nombre": "",
      "cantidad": 0,
      "participacion_pct": 0.0,
      "perfil": {
        "tipo_pqrs": {"moda": "", "distribucion": {}},
        "causa": {"moda": "", "distribucion": {}},
        "canal": {"moda": "", "distribucion": {}},
        "servicio": {"moda": "", "distribucion": {}}
      }
    }
  ]
}
```

### GET /api/clusters/{cluster_id}

**Descripción**: Perfil detallado de un cluster específico.

**Respuesta:** Perfil completo del cluster con todas las variables.

### GET /api/insights

**Descripción**: Insights generados desde el análisis.

**Respuesta:**

```json
{
  "insights": [
    {
      "tipo": "hallazgo|oportunidad|tendencia",
      "titulo": "",
      "descripcion": "",
      "metrica": "",
      "valor": ""
    }
  ]
}
```

### GET /api/textual

**Descripción**: Resultados del análisis textual (si aplica).

### GET /api/filtros

**Descripción**: Valores disponibles para cada filtro.

**Respuesta:**

```json
{
  "tipos": ["Queja", "Reclamo", "Peticion", "Sugerencia"],
  "causas": ["..."],
  "canales": ["..."],
  "servicios": ["..."],
  "clusters": [0, 1, 2],
  "periodo": {
    "meses": ["2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"]
  }
}
```

---

## Configuración

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="HeLi Analytics API",
    description="API del Centro de Inteligencia de PQRS - HeLi Salud IPS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Carga de datos

La API carga los JSON generados por el pipeline de análisis al iniciar:

```python
# Carga de datos al inicio
import json

with open("app/data/resumen.json", "r") as f:
    resumen_data = json.load(f)
```

> Los datos son estáticos (generados por el análisis). La API solo los expone, no los procesa en tiempo real.

---

## Ejecución

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Documentación Swagger
# http://localhost:8000/docs
```

---

## requirements.txt

```
fastapi>=0.100.0
uvicorn[standard]>=0.23.0
pydantic>=2.0.0
```
