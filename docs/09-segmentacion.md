# 09 — Segmentación (Clustering)

## Objetivo

Agrupar las PQRS en clusters (grupos) con características similares para identificar patrones de comportamiento dentro de la población analizada.

---

## Tipo de variables para segmentación

| Variable | Tipo | Rol en clustering | Transformación |
|----------|------|-------------------|----------------|
| Tipo de PQRS | Categórica nominal | Segmentación | Codificación directa |
| Causa de inconformidad | Categórica nominal | Segmentación | Codificación directa |
| Canal de ingreso | Categórica nominal | Segmentación | Codificación directa |
| Servicio asociado | Categórica nominal | Segmentación | Codificación directa |
| Tiempo de respuesta | Numérica continua | Segmentación | Normalización (min-max o z-score) |
| Mes de radicación | Categórica ordinal | Auxiliar | Opcional |

> La selección definitiva de variables se realizará después del EDA, cuando se conozca la distribución real de cada variable y su variabilidad.

---

## Evaluación de algoritmos

### Opción 1: K-Modes

| Aspecto | Detalle |
|---------|---------|
| Tipo de datos | Variables categóricas exclusivamente |
| Métrica de distancia | Hamming (discrepancia) |
| Función de costos | Número total de discrepancias |
| Ventajas | Diseñado para categóricas, interpretable, rápido |
| Limitaciones | No maneja variables numéricas nativamente |
| Biblioteca | `kmodes` (Python) |

**Cuándo usar**: Si el dataset tiene predominantemente variables categóricas y la variable numérica (tiempo de respuesta) no es esencial para la segmentación.

### Opción 2: K-Prototypes

| Aspecto | Detalle |
|---------|---------|
| Tipo de datos | Mixto (categóricas + numéricas) |
| Métrica de distancia | Hamming (categóricas) + Euclidiana (numéricas) |
| Parámetro gamma | Balance entre las dos métricas |
| Ventajas | Combina ambos tipos nativamente |
| Limitaciones | Requiere ajuste de gamma, más complejo |
| Biblioteca | `kmodes` (Python) |

**Cuándo usar**: Si se decide incluir el tiempo de respuesta como variable de segmentación y se quiere que influya en la formación de clusters.

### Opción 3: MCA + K-Means

| Aspecto | Detalle |
|---------|---------|
| Tipo de datos | Categóricas transformadas a componentes |
| Método | Correspondencia Múltiple (MCA) → reducción dimensional → K-Means |
| Ventajas | Reduce dimensionalidad, permite usar K-Means estándar |
| Limitaciones | Pierde interpretabilidad directa, requiere análisis de componentes |
| Biblioteca | `prince` + `scikit-learn` |

**Cuándo usar**: Si hay alta cardinalidad en las variables categóricas y se necesita reducir dimensionalidad antes del clustering.

---

## Criterio de selección del algoritmo

| Criterio | K-Modes | K-Prototypes | MCA + K-Means |
|----------|---------|--------------|---------------|
| Variables mayoritariamente categóricas | Sí | Sí | Sí |
| Variables numéricas en segmentación | No | Sí | Indirecto |
| Interpretabilidad | Alta | Alta | Media |
| Complejidad de implementación | Baja | Media | Alta |
| Documento académico lo sugiere | No explícito | No explícito | No explícito |

### Decisión preliminar

**Se recomienda evaluar K-Modes o K-Prototypes** dependiendo de si se incluye el tiempo de respuesta en la segmentación. Ambos algoritmos son adecuados para el tipo de datos del proyecto.

La decisión final se tomará después de:

1. Conocer la distribución real de las variables.
2. Evaluar la variabilidad de cada variable.
3. Determinar si el tiempo de respuesta aporta valor al clustering.

---

## Selección del número de clusters (k)

### Método del codo (Elbow Method)

```python
# Para K-Modes
costs = []
K_range = range(2, 10)
for k in K_range:
    km = KModes(n_clusters=k, init='random', n_init=5, random_state=42)
    km.fit(data)
    costs.append(km.cost_)

# Gráfico del codo
plt.plot(K_range, costs, 'bo-')
plt.xlabel('Número de clusters (k)')
plt.ylabel('Costo (discrepancias)')
plt.title('Método del codo para K-Modes')
```

### Coeficiente de silueta para datos categóricos

```python
# Silueta usando distancia de Hamming
from sklearn.metrics import silhouette_score
from sklearn.metrics.pairwise import manhattan_distances

# Calcular silueta para cada k
for k in K_range:
    km = KModes(n_clusters=k, random_state=42)
    labels = km.fit_predict(data)
    sil = silhouette_score(data, labels, metric='hamming')
```

### Criterios de selección

| Criterio | Descripción |
|----------|-------------|
| Codo evidente | El punto donde la curva de costo cambia de pendiente |
| Silueta alta | Valor de silueta cercano a 1 |
| Interpretabilidad | Cada cluster debe tener un perfil claro |
| Balance | Ningún cluster debe tener < 5% de los registros |
| Coherencia académica | El número de clusters debe justificarse |

> No se selecciona k arbitrariamente. Se documenta la justificación técnica y académica.

---

## Proceso de clustering

### Paso 1: Preparación de datos

```python
# Seleccionar variables para clustering
cluster_vars = ['tipo_pqrs', 'causa', 'canal', 'servicio']

# Si se usa K-Prototypes, agregar variable numérica
# cluster_vars_num = ['dias_respuesta']

# Crear matriz de clustering
data_cluster = df[cluster_vars].copy()
```

### Paso 2: Determinación de k

```python
# Evaluar k = 2 a 9
# Gráfico del codo
# Coeficiente de silueta
# Seleccionar k con mejor balance
```

### Paso 3: Entrenamiento

```python
# K-Modes
from kmodes.kmodes import KModes

km = KModes(n_clusters=k_elegido, init='random', n_init=10, random_state=42)
clusters = km.fit_predict(data_cluster)

# Asignar clusters al dataframe
df['cluster'] = clusters
```

### Paso 4: Validación

| Métrica | Descripción | Valor esperado |
|---------|-------------|----------------|
| Costo total | Número total de discrepancias | Mínimo posible |
| Silueta | Cohesión vs. separación | Cercano a 1 |
| Tamaño de clusters | Distribución por cluster | Balanceado (> 5% cada uno) |
| Perfil de clusters | Características de cada grupo | Claro e interpretable |

### Paso 5: Interpretación

Para cada cluster, calcular:

```python
# Perfil del cluster
for cluster_id in range(k_elegido):
    cluster_data = df[df['cluster'] == cluster_id]
    
    # Tamaño
    size = len(cluster_data)
    pct = size / len(df) * 100
    
    # Variables categóricas: moda y distribución
    for var in cluster_vars:
        print(cluster_data[var].value_counts(normalize=True))
    
    # Variable numérica: estadísticas
    if 'dias_respuesta' in df.columns:
        print(cluster_data['dias_respuesta'].describe())
```

---

## Formato de interpretación de clusters

```markdown
### Cluster X: [Nombre descriptivo]

**Perfil:**
[Descripción del comportamiento predominante en este grupo]

**Características principales:**
- Tipo de PQRS predominante: [X] ([XX%])
- Causa más frecuente: [X] ([XX%])
- Canal más utilizado: [X] ([XX%])
- Servicio más asociado: [X] ([XX%])
- Tiempo promedio de respuesta: [X] días

**Cantidad de registros:** XXX
**Participación:** XX%

**Interpretación:**
[Análisis del significado de este cluster en el contexto de HeLi Salud IPS]
```

> Los nombres de los clusters se derivan de sus características reales. No se inventan antes del análisis.

---

## Limitaciones del clustering

1. Los clusters identifican patrones de comportamiento, no relaciones causales.
2. La calidad depende de la variabilidad de las variables seleccionadas.
3. Con 2,252 registros, el análisis es representativo para la institución pero no generalizable.
4. Variables no incluidas en el clustering pueden explicar variación no capturada.
5. El número de clusters es una decisión que requiere justificación técnica y académica.

---

## Exportación de resultados

```json
{
  "segmentacion": {
    "algoritmo": "K-Modes",
    "num_clusters": 0,
    "variables_utilizadas": ["tipo_pqrs", "causa", "canal", "servicio"],
    "metrica_calidad": {
      "costo_total": 0,
      "silueta": 0.0
    },
    "clusters": [
      {
        "id": 0,
        "nombre": "[Pendiente de análisis]",
        "cantidad_registros": 0,
        "participacion_pct": 0.0,
        "perfil": {
          "tipo_pqrs": {"moda": "", "distribucion": {}},
          "causa": {"moda": "", "distribucion": {}},
          "canal": {"moda": "", "distribucion": {}},
          "servicio": {"moda": "", "distribucion": {}}
        },
        "interpretacion": "[Pendiente de análisis]"
      }
    ]
  }
}
```
