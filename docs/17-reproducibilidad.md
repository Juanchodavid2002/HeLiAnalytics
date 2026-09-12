# 17 — Reproducibilidad

## Objetivo

Garantizar que cualquier persona externa pueda entender, ejecutar y reproducir el análisis completo de HeLi Analytics.

---

## Flujo de reproducción

```
¿Qué datos entraron?
        ↓
¿Cómo fueron limpiados?
        ↓
¿Qué variables se utilizaron?
        ↓
¿Qué análisis se realizaron?
        ↓
¿Qué algoritmo se utilizó?
        ↓
¿Cómo se obtuvieron los clusters?
        ↓
¿Cómo llegaron esos resultados a la aplicación?
```

---

## Requisitos para reproducción

### Software requerido

| Componente | Versión | Propósito |
|-----------|---------|-----------|
| Python | 3.10+ | Análisis de datos |
| Node.js | 18+ | Angular |
| npm | 9+ | Gestión de paquetes Angular |
| Git | 2.0+ | Control de versiones |

### Dependencias de Python

```
# analysis/requirements.txt
pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
kmodes>=0.12.0
matplotlib>=3.7.0
seaborn>=0.12.0
ydata-profiling>=4.0.0
spacy>=3.6.0
fastapi>=0.100.0
uvicorn>=0.23.0
pydantic>=2.0.0
```

### Dependencias de Angular

```json
{
  "dependencies": {
    "@angular/core": "^17.0.0",
    "ngx-echarts": "^16.0.0",
    "echarts": "^5.5.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## Instrucciones de reproducción

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/[usuario]/heli-analytics.git
cd heli-analytics
```

### Paso 2: Verificar datos

```bash
# El dataset original debe estar en:
ls data/raw/

# Si no está, contactar a HeLi Salud IPS para obtenerlo
```

### Paso 3: Ejecutar pipeline de datos

```bash
cd analysis/notebooks

# Abrir Jupyter y ejecutar en orden:
# 1. 01_carga_y_perfilamiento.ipynb
# 2. 02_limpieza_y_estandarizacion.ipynb
# 3. 03_eda.ipynb
# 4. 04_clustering.ipynb
# 5. 05_exportacion_resultados.ipynb
```

### Paso 4: Verificar resultados

```bash
# Los resultados JSON deben estar en:
ls backend/app/data/

# Archivos esperados:
# - resumen.json
# - distribuciones.json
# - cruces.json
# - clusters.json
# - insights.json
# - temporal.json
# - textual.json (si aplica)
```

### Paso 5: Ejecutar API

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Verificar: http://localhost:8000/docs
```

### Paso 6: Ejecutar Frontend

```bash
cd frontend/angular-app
npm install
ng serve

# Verificar: http://localhost:4200
```

---

## Estructura reproducible

```
heli-analytics/
│
├── data/
│   ├── raw/                          # Datos originales (NO modificar)
│   │   └── [dataset original]
│   ├── processed/                    # Datos derivados
│   │   ├── pqrs_analitico_v2.csv
│   │   └── CHANGELOG.md
│   └── README.md                     # Instrucciones para obtener datos
│
├── analysis/
│   ├── requirements.txt              # Dependencias de Python
│   ├── notebooks/                    # Notebooks reproducibles
│   │   ├── 01_carga_y_perfilamiento.ipynb
│   │   ├── 02_limpieza_y_estandarizacion.ipynb
│   │   ├── 03_eda.ipynb
│   │   ├── 04_clustering.ipynb
│   │   └── 05_exportacion_resultados.ipynb
│   └── src/                          # Módulos Python reutilizables
│       ├── __init__.py
│       ├── data_loader.py
│       ├── cleaning.py
│       ├── eda.py
│       ├── clustering.py
│       └── export.py
│
├── backend/
│   ├── app/
│   │   ├── data/                     # JSONs generados por análisis
│   │   ├── main.py
│   │   ├── routes/
│   │   └── models/
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   └── angular-app/
│       ├── src/
│       ├── package.json
│       └── angular.json
│
├── docs/                             # Documentación completa
│   ├── 01-vision.md
│   ├── ... (17 documentos)
│
├── scripts/                          # Scripts auxiliares
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## Trazabilidad

Cada resultado en la aplicación debe poder rastrearse hasta:

```
Resultado en el dashboard
        ↑
Respuesta de la API (endpoint + JSON)
        ↑
Archivo JSON generado por el análisis
        ↑
Notebook de Jupyter que lo generó
        ↓
Dataset analítico de entrada
        ↓
Dataset crudo original
```

### Ejemplo de trazabilidad

```
"Total PQRS: 2,252" en el dashboard
        ↑
GET /api/resumen → resumen.total_pqrs = 2252
        ↑
backend/app/data/resumen.json → "total_pqrs": 2252
        ↑
05_exportacion_resultados.ipynb → len(df) = 2252
        ↑
02_limpieza_y_estandarizacion.ipynb → df_limpio
        ↑
01_carga_y_perfilamiento.ipynb → pd.read_csv("data/raw/pqrs.csv")
        ↑
data/raw/pqrs.csv → Archivo original de HeLi Salud IPS
```

---

## Reglas de reproducibilidad

1. **No modificar `data/raw/`**: Los datos originales nunca se alteran.
2. **Documentar cada paso**: Cada notebook tiene celdas de texto explicativo.
3. **Versionar datasets**: Cada versión del dataset analítico se nombra con versión.
4. **Fijar semillas**: Cuando se use `random_state`, fijar el valor para reproducibilidad.
5. **Especificar versiones**: Las dependencias tienen versiones mínimas especificadas.
6. **Notebooks secuenciales**: Los notebooks se ejecutan en orden numérico.
7. **Exports atómicos**: Cada exportación genera un archivo nuevo, no sobrescribe.

---

## Change Log de datasets

El archivo `data/processed/CHANGELOG.md` documenta cada cambio:

```markdown
# CHANGELOG — Datasets

## v1 — [Fecha]
- Dataset inicial limpio
- 2,252 registros
- Variables: [lista]
- Tratamiento de nulos: [descripción]
- Duplicados removidos: [cantidad]

## v2 — [Fecha] (si aplica)
- Corrección: [descripción]
- Registros afectados: [cantidad]
```
