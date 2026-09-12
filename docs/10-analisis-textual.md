# 10 — Análisis Textual

## Estado

> **[PENDIENTE DE DEFINIR]** — Este análisis se realizará únicamente si el dataset contiene una columna de descripción textual de las PQRS.

---

## Objetivo

Si el dataset incluye una columna con la descripción en texto libre de las inconformidades, se realizará un análisis de lenguaje natural (NLP) para extraer información adicional que complementa el análisis cuantitativo.

---

## Variables de entrada

| Variable | Tipo | Condición |
|----------|------|-----------|
| Descripción textual de la PQRS | Texto libre en español | Debe existir en el dataset |

---

## Pipeline de análisis textual

```
┌──────────────────┐
│ Texto original   │   Descripción de cada PQRS
│ (texto libre)    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Limpieza de      │
│ texto            │
│                  │
│ • Minúsculas     │
│ • Eliminar       │
│   puntuación     │
│ • Eliminar       │
│   números        │
│ • Eliminar       │
│   stopwords      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Tokenización     │
│                  │
│ Dividir en       │
│ tokens           │
│ (palabras)       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Análisis de      │
│ frecuencia       │
│                  │
│ • Unigramas      │
│ • Bigramas       │
│ • Trigramas      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Extracción de    │
│ temas/clusters   │
│ textuales        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Resultados       │
│                  │
│ JSON para API    │
└──────────────────┘
```

---

## Herramientas

| Herramienta | Función | Justificación |
|-------------|---------|---------------|
| spaCy | Tokenización, lematización, NER | Modelo en español (`es_core_news_sm`) |
| NLTK | Stopwords en español | Complemento para stopwords |
| Pandas | Manipulación de textos | Procesamiento vectorizado |
| collections.Counter | Frecuencias | Conteo de tokens |
| Matplotlib / WordCloud | Visualización | Nubes de palabras, barras de frecuencia |

---

## Técnicas de análisis

### 1. Limpieza de texto

```python
import spacy

nlp = spacy.load("es_core_news_sm")

def limpiar_texto(texto):
    doc = nlp(texto.lower())
    tokens = [
        token.lemma_ for token in doc
        if not token.is_stop
        and not token.is_punct
        and not token.is_space
        and len(token.text) > 2
    ]
    return " ".join(tokens)
```

**Stopwords en español para eliminar:**

- Artículos: el, la, los, las, un, una, unos, unas
- Preposiciones: de, del, en, a, al, por, para, con, sin, sobre
- Conjunciones: y, o, ni, pero, sino, que, como
- Pronombres: yo, tú, él, ella, usted, nosotros, ellos
- Verbos comunes: ser, estar, haber, tener, hacer, ir, poder, querer

### 2. Análisis de frecuencia

**Unigramas (palabras individuales):**

| Salida | Descripción |
|--------|-------------|
| Top 20 palabras más frecuentes | Barras horizontales |
| Frecuencia relativa | Porcentaje de aparición |

**Bigramas (pares de palabras):**

| Salida | Descripción |
|--------|-------------|
| Top 10 bigramas más frecuentes | Barras horizontales |
| Bigramas por tipo de PQRS | Comparativa |

**Trigramas (tres palabras):**

| Salida | Descripción |
|--------|-------------|
| Top 10 trigramas | Solo si hay suficiente volumen |

### 3. Análisis por tipo de PQRS

- Frecuencia de palabras por tipo (Queja vs. Reclamo vs. Petición vs. Sugerencia).
- Palabras exclusivas o más frecuentes en cada tipo.
- Comparativa de vocabulario entre tipos.

### 4. Extracción de temas (opcional)

Si el volumen de textos lo permite:

| Método | Descripción | Biblioteca |
|--------|-------------|-----------|
| LDA | Latent Dirichlet Allocation | `gensim` o `sklearn` |
| NMF | Non-negative Matrix Factorization | `sklearn` |
| TF-IDF + Clustering | Vectorización + agrupamiento | `sklearn` |

> La extracción de temas es opcional y depende del volumen y calidad de los textos.

---

## Formato de resultados

```json
{
  "analisis_textual": {
    "total_textos_analizados": 0,
    "promedio_longitud_tokens": 0.0,
    "palabras_mas_frecuentes": [
      {"palabra": "", "frecuencia": 0, "frecuencia_relativa": 0.0}
    ],
    "bigramas_mas_frecuentes": [
      {"bigrama": "", "frecuencia": 0}
    ],
    "palabras_por_tipo": {
      "Queja": [{"palabra": "", "frecuencia": 0}],
      "Reclamo": [{"palabra": "", "frecuencia": 0}],
      "Peticion": [{"palabra": "", "frecuencia": 0}],
      "Sugerencia": [{"palabra": "", "frecuencia": 0}]
    }
  }
}
```

---

## Visualizaciones

| # | Visualización | Tipo | Página |
|---|--------------|------|--------|
| 1 | Top 20 palabras frecuentes | Barras horizontales | Análisis textual |
| 2 | Top 10 bigramas | Barras horizontales | Análisis textual |
| 3 | Palabras por tipo de PQRS | Barras agrupadas | Análisis textual |
| 4 | Nube de palabras (opcional) | WordCloud | Análisis textual |

---

## Consideraciones

1. **Calidad del texto**: Si las descripciones son muy cortas o inconsistentes, el análisis textual puede no aportar valor.
2. **Volume mínimo**: Se recomienda al menos 100 textos con contenido significativo.
3. **Idioma**: Los textos están en español. Se usa spaCy con modelo `es_core_news_sm`.
4. **Privacidad**: Los textos no deben contener datos personales. Si los contienen, se sanitizan antes del análisis.
5. **No es solo nube de palabras**: El análisis va más allá de frecuencias simples, incluyendo bigramas, comparativas por tipo y posiblemente extracción de temas.
