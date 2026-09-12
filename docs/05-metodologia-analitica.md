# 05 — Metodología Analítica

## Enfoque metodológico

| Aspecto | Descripción |
|---------|-------------|
| Enfoque | Cuantitativo |
| Alcance | Descriptivo-analítico |
| Diseño | No experimental, transversal |
| Población | 2,252 registros de PQRS (II semestre 2025) |
| Muestreo | Censo (totalidad de la población) |

### Justificación del enfoque cuantitativo

El enfoque cuantitativo se justifica porque:

- Se analizan datos numéricos y variables medibles.
- Se identifican patrones, frecuencias y relaciones entre variables.
- Se utilizan herramientas de analítica de datos para procesamiento y segmentación.
- Es coherente con el objetivo de generar resultados objetivos y medibles.

### Justificación del diseño no experimental

- No se manipulan variables ni se intervienen sobre los registros.
- Solo se observan y analizan datos existentes.
- Se respetan los valores tal como fueron registrados por la institución.

### Justificación del diseño transversal

- La información se analiza en un único periodo (II semestre 2025).
- Se obtiene un "snapshot" del comportamiento de las PQRS en ese periodo.
- No se comparan periodos diferentes.

---

## Diseño de investigación en 5 fases

### Fase 1: Recolección de información

| Actividad | Detalle |
|-----------|---------|
| Obtención de datos | Registros de PQRS del II semestre 2025 |
| Fuente | Base de datos institucional de HeLi Salud IPS |
| Formato | [PENDIENTE — CSV o Excel] |
| Autorización | Registros autorizados por la organización |

### Fase 2: Depuración y preparación de datos

| Actividad | Descripción |
|-----------|-------------|
| Eliminación de duplicados | Identificar y remover registros repetidos |
| Revisión de inconsistencias | Verificar coherencia entre campos |
| Tratamiento de datos faltantes | Analizar nulos, decidir imputación o exclusión |
| Estandarización de categorías | Normalizar nombres de categorías |
| Organización de variables | Estructurar columnas para análisis |
| Validación de integridad | Verificar rangos, formatos y tipos |

**Resultado**: Dataset estructurado y apto para análisis.

### Fase 3: Análisis descriptivo

| Técnica | Aplicación |
|---------|-----------|
| Tablas de frecuencia | Distribución de cada variable categórica |
| Distribuciones porcentuales | Proporciones por categoría |
| Medidas de tendencia central | Media, mediana, moda para variables numéricas |
| Cruces de variables | Relaciones entre pares de variables |
| Visualizaciones gráficas | Barras, líneas, donuts, heatmaps, treemaps |
| Tablas dinámicas | Consolidación multidimensional |

**Variables del análisis:**

- Tipo de PQRS
- Causas más frecuentes
- Servicios asociados
- Canales de radicación
- Tiempos de respuesta
- Distribución temporal

### Fase 4: Segmentación e identificación de patrones

| Actividad | Descripción |
|-----------|-------------|
| Selección de variables | Variables categóricas y numéricas relevantes |
| Selección de algoritmo | K-Modes, K-Prototypes o MCA+K-Means (según tipo de datos) |
| Determinación de clusters | Método del codo, silueta, o criterios académicos |
| Ejecución del clustering | Entrenamiento del modelo |
| Validación | Métricas de calidad de clusters |
| Interpretación | Perfil de cada cluster con nombre descriptivo |

**Variables de segmentación:**

- Causa de inconformidad
- Servicio asociado
- Canal de ingreso
- Tipo de PQRS
- Tiempo de respuesta (si es numérico)

### Fase 5: Interpretación de resultados

| Actividad | Descripción |
|-----------|-------------|
| Relación con objetivos | Verificar cumplimiento de OE1, OE2, OE3 |
| Contexto institucional | Interpretar resultados en el marco de HeLi Salud IPS |
| Oportunidades de mejora | Derivar acciones concretas de los hallazgos |
| Conclusiones | Generar conclusiones basadas en evidencia |
| Limitaciones | Documentar limitaciones del estudio |

---

## Técnicas de análisis de datos

### Análisis exploratorio de datos (EDA)

El EDA es el primer paso del análisis y permite:

- Comprender la estructura del dataset.
- Identificar inconsistencias y valores atípicos.
- Reconocer variables relevantes.
- Generar hipótesis iniciales.

**Herramientas**: Pandas, ydata-profiling (opcional), Matplotlib, Seaborn.

### Estadística descriptiva

| Medida | Tipo de variable | Aplicación |
|--------|-----------------|------------|
| Frecuencia absoluta | Categórica | Conteo por categoría |
| Frecuencia relativa | Categórica | Proporción por categoría |
| Moda | Categórica | Categoría más frecuente |
| Media | Numérica | Valor promedio |
| Mediana | Numérica | Valor central |
| Desviación estándar | Numérica | Dispersión |
| Mínimo / Máximo | Numérica | Rango de valores |
| Percentiles | Numérica | Distribución |

### Cruces de variables

Los cruces permiten identificar relaciones entre pares de variables. Solo se realizan cruces que tengan valor analítico real:

| Cruce | Justificación |
|-------|--------------|
| Tipo × Causa | Identificar qué causas predominan en cada tipo de PQRS |
| Tipo × Servicio | Determinar si ciertos servicios generan más tipos específicos |
| Causa × Servicio | Relacionar causas con servicios específicos |
| Causa × Canal | Identificar si ciertas causas se radican por canales específicos |
| Servicio × Canal | Determinar qué canales usan los pacientes de cada servicio |
| Servicio × Tiempo respuesta | Evaluar si el tiempo varía según el servicio |
| Causa × Tiempo respuesta | Evaluar si ciertas causas tienen tiempos de respuesta diferentes |

> No se realizan cruces únicamente por completar la lista. Cada cruce debe aportar información analítica relevante.

### Segmentación (Clustering)

Ver documento [09-segmentacion.md](./09-segmentacion.md) para detalles completos del algoritmo, selección y validación.

---

## Herramientas tecnológicas

| Herramienta | Función | Justificación académica |
|-------------|---------|------------------------|
| Python 3.x | Lenguaje principal de análisis | Estándar de la industria para data science |
| Pandas | Manipulación y análisis de datos | Biblioteca más utilizada para datos tabulares |
| NumPy | Cálculo numérico | Base para operaciones vectorizadas |
| Scikit-learn | Machine learning (clustering) | Biblioteca estándar para algoritmos de ML |
| kmodes | Clustering para variables categóricas | Algoritmo específico para datos categóricos |
| Matplotlib | Visualización base | Complemento para gráficos estáticos |
| Seaborn | Visualización estadística | Gráficos estadísticos de alta calidad |
| ydata-profiling | Perfilamiento automatizado | Generación automática de reportes EDA |
| spaCy | Procesamiento de lenguaje natural | Análisis de texto en español (opcional) |
| Jupyter Notebook | Documentación del análisis | Entorno interactivo reproducible |

> El documento académico original menciona Excel y Power BI. El presente proyecto utiliza Python como reemplazo directo para el análisis (más robusto y reproducible) y Angular+ECharts para la visualización (en lugar de Power BI, con control total del diseño).

---

## Consideraciones éticas

1. **Anonimización**: Los datos se tratan de manera anonimizada. No se utilizan datos personales identificables.
2. **Finalidad académica**: El análisis se realiza exclusivamente con fines académicos e institucionales.
3. **No juicios individuales**: Los resultados no se utilizan para generar juicios sobre pacientes, colaboradores o áreas específicas.
4. **Cumplimiento normativo**: Ley 1581 de 2012 (protección de datos personales), Decreto 1011 de 2006 (calidad en salud).
5. **Acceso restringido**: Los datos se manejan con acceso limitado y circulación controlada.
