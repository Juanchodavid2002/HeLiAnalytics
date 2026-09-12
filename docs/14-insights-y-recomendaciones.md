# 14 — Insights y Recomendaciones

## Objetivo

Generar una sección de insights (hallazgos clave) derivados exclusivamente de los resultados reales del análisis de datos de PQRS.

---

## Definición de insight

Un insight es una conclusión accionable derivada de los datos que responde a una pregunta analítica relevante para HeLi Salud IPS.

---

## Tipos de insights

| Tipo | Descripción | Ejemplo conceptual |
|------|-------------|-------------------|
| **Hallazgo** | Descubrimiento principal del análisis | "Las quejas representan el XX% de todas las PQRS" |
| **Oportunidad** | Área de mejora identificada | "El servicio X tiene el mayor tiempo promedio de respuesta" |
| **Tendencia** | Patrón temporal detectado | "Las PQRS aumentaron un XX% entre julio y diciembre" |
| **Patrón** | Comportamiento recurrente identificado por clustering | "El cluster X concentra el XX% de los registros" |
| **Prioridad** | Causa o servicio que requiere atención inmediata | "La causa X representa el XX% de los reclamos" |

> EJEMPLOS: Los textos anteriores son ilustrativos. Los insights reales se generarán después del análisis con datos reales.

---

## Metodología de generación

### Paso 1: Extraer métricas clave

```python
# Ejemplo conceptual
insights = []

# Distribución por tipo
tipo_counts = df['tipo_pqrs'].value_counts(normalize=True)
tipo_dominante = tipo_counts.index[0]
tipo_pct = tipo_counts.iloc[0] * 100

if tipo_pct > 50:
    insights.append({
        "tipo": "hallazgo",
        "titulo": f"Predominancia de {tipo_dominante}",
        "descripcion": f"Las {tipo_dominante.lower()} representan el {tipo_pct:.1f}% de las PQRS analizadas.",
        "metrica": f"{tipo_pct:.1f}%",
        "valor": tipo_dominante
    })
```

### Paso 2: Identificar causas críticas

```python
causa_counts = df['causa'].value_counts(normalize=True)
causa_top3 = causa_counts.head(3)

# Verificar si las top 3 causas concentran la mayoría
top3_pct = causa_top3.sum() * 100
if top3_pct > 60:
    insights.append({
        "tipo": "prioridad",
        "titulo": "Concentración de causas",
        "descripcion": f"Las 3 causas más frecuentes concentran el {top3_pct:.1f}% de las PQRS.",
        "metrica": f"{top3_pct:.1f}%",
        "valor": list(causa_top3.index)
    })
```

### Paso 3: Analizar servicios críticos

```python
servicio_tiempo = df.groupby('servicio')['dias_respuesta'].mean()
servicio_mas_lento = servicio_tiempo.idxmax()
tiempo_max = servicio_tiempo.max()

insights.append({
    "tipo": "oportunidad",
    "titulo": f"Tiempo de respuesta en {servicio_mas_lento}",
    "descripcion": f"El servicio {servicio_mas_lento} tiene un tiempo promedio de {tiempo_max:.1f} días.",
    "metrica": f"{tiempo_max:.1f} días",
    "valor": servicio_mas_lento
})
```

### Paso 4: Incorporar resultados de clustering

```python
# Desde los resultados del clustering
for cluster in clusters_data:
    if cluster['participacion_pct'] > 30:
        insights.append({
            "tipo": "patron",
            "titulo": f"Cluster predominante: {cluster['nombre']}",
            "descripcion": f"El segmento '{cluster['nombre']}' concentra el {cluster['participacion_pct']:.1f}% de las PQRS.",
            "metrica": f"{cluster['participacion_pct']:.1f}%",
            "valor": cluster['nombre']
        })
```

### Paso 5: Análisis temporal

```python
# Comparar primer semestre vs segundo (si hay datos)
# O comparar meses dentro del segundo semestre
mes_max = df.groupby('mes').size().idxmax()
mes_min = df.groupby('mes').size().idxmin()

insights.append({
    "tipo": "tendencia",
    "titulo": "Variación mensual",
    "descripcion": f"El mes con más PQRS fue {mes_max} y el menos {mes_min}.",
    "metrica": "Variación mensual",
    "valor": f"{mes_max} / {mes_min}"
})
```

---

## Formato de presentación en la app

```markdown
┌──────────────────────────────────────────────────────┐
│                                                      │
│  INSIGHTS — Hallazgos del Análisis                   │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  PRINCIPAL HALLAZGO                           │   │
│  │                                               │   │
│  │  Las [quejas] representan el [XX%] de las    │   │
│  │  PQRS analizadas, constituyendo la categoría │   │
│  │  predominante en el periodo de estudio.       │   │
│  │                                               │   │
│  │  [XX%]  │  Tipo: Queja                       │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  OPORTUNIDAD DE MEJORA                        │   │
│  │                                               │   │
│  │  El servicio [X] presenta el mayor tiempo    │   │
│  │  promedio de respuesta con [X] días.          │   │
│  │                                               │   │
│  │  [X días]  │  Servicio: [X]                   │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  PATRÓN DE SEGMENTACIÓN                       │   │
│  │                                               │   │
│  │  El cluster [X] concentra el [XX%] de las    │   │
│  │  PQRS, caracterizado por [descripción].       │   │
│  │                                               │   │
│  │  [XX%]  │  Cluster: [X]                       │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Reglas para insights

1. **Solo datos reales**: Nunca inventar cantidades, porcentajes o conclusiones.
2. **Específicos**: Cada insight debe incluir una métrica concreta.
3. **Accionables**: Cada insight debe sugerir un área de atención.
4. **Contextualizados**: Relacionar con el contexto de salud mental y HeLi Salud IPS.
5. **Limitaciones**: Documentar cuando un insight tiene limitaciones metodológicas.

---

## Cantidad esperada

Se espera generar entre **5 y 10 insights** significativos, cubriendo al menos:

- 1-2 hallazgos principales (distribución general)
- 1-2 oportunidades de mejora (servicios o causas críticas)
- 1-2 tendencias temporales
- 1-2 patrones de segmentación
- 1 prioridad (causa o servicio que requiere atención inmediata)

---

## Exportación JSON

```json
{
  "insights": [
    {
      "tipo": "hallazgo|oportunidad|tendencia|patron|prioridad",
      "titulo": "",
      "descripcion": "",
      "metrica": "",
      "valor": "",
      "orden": 1
    }
  ],
  "fecha_generacion": "2025-XX-XX",
  "total_registros_analizados": 2252,
  "periodo": "II semestre 2025"
}
```
