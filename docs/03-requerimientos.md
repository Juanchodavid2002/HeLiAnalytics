# 03 — Requerimientos

## Requerimientos funcionales

### RF-01: Dashboard principal

El sistema debe presentar un panel principal (dashboard) que muestre los indicadores clave de las PQRS analizadas.

**Indicadores a mostrar:**

| KPI | Descripción |
|-----|-------------|
| Total de PQRS analizadas | Cantidad total de registros del periodo |
| Distribución por tipo | Porcentaje de Petición, Queja, Reclamo, Sugerencia |
| Causa más frecuente | La causa con mayor número de registros |
| Canal más utilizado | El canal de ingreso predominante |
| Tiempo promedio de respuesta | Promedio de días entre radicación y cierre |
| Servicio con más PQRS | El servicio con mayor concentración de registros |

> Los valores se obtienen exclusivamente de los datos reales. No se utilizan valores ficticios.

### RF-02: Filtros interactivos

El sistema debe permitir filtrar la información por:

- **Periodo**: Meses del segundo semestre de 2025 (julio-diciembre).
- **Servicio**: Servicios de salud mental disponibles en los datos.
- **Tipo de PQRS**: Petición, Queja, Reclamo, Sugerencia.
- **Causa**: Causas de inconformidad disponibles.
- **Canal de ingreso**: Canales por los cuales se radicaron las PQRS.
- **Cluster**: Grupos resultantes de la segmentación.

Los filtros deben actualizarse dinámicamente y afectar todos los gráficos y KPIs visibles.

### RF-03: Página de distribuciones (Tendencias)

Presentar visualizaciones de:

- Distribución temporal de PQRS por mes.
- Distribución por tipo de PQRS.
- Distribución por canal de ingreso.
- Tendencia de registros a lo largo del periodo.

### RF-04: Página de causas

Presentar:

- Ranking de las causas más frecuentes.
- Distribución porcentual de causas.
- Cruces de causas con tipo de PQRS y canal de ingreso.
- Gráficos comparativos de causas.

### RF-05: Página de servicios

Presentar:

- Distribución de PQRS por servicio de salud mental.
- Cruces de servicio con causa y tipo de PQRS.
- Servicios con mayor concentración de inconformidades.

### RF-06: Página de segmentación

Presentar los resultados del clustering:

- Número de clusters identificados.
- Distribución de registros por cluster.
- Características principales de cada cluster.
- Tamaño y participación porcentual de cada cluster.
- Al seleccionar un cluster, mostrar su perfil detallado:
  - Variables predominantes.
  - Cantidad de registros.
  - Participación porcentual.
  - Nombre descriptivo derivado de sus características.

### RF-07: Página de análisis textual

Si el dataset contiene una columna de descripción de PQRS:

- Frecuencia de términos relevantes.
- Análisis de n-gramas.
- Identificación de temas o categorías textuales.
- Visualización de términos más frecuentes.

### RF-08: Página de insights

Presentar conclusiones derivadas de los resultados reales:

- Principales hallazgos del análisis.
- Causas críticas identificadas.
- Patrones relevantes de segmentación.
- Oportunidades de mejora.

> Los insights se generan exclusivamente a partir de los datos reales. No se crean conclusiones ficticias.

### RF-09: Simulación de escenarios (opcional)

Si se incorpora, debe presentarse claramente como **escenario hipotético**:

- Ejemplo: "¿Qué pasaría si las PQRS relacionadas con X disminuyeran un 20%?"
- NO se presenta como predicción si el modelo no tiene capacidad predictiva.

---

## Requerimientos no funcionales

### RNF-01: Rendimiento

- El dashboard debe cargar en menos de 3 segundos.
- Los filtros deben actualizar los gráficos en menos de 1 segundo.
- La API debe responder en menos de 500ms para consultas estándar.

### RNF-02: Privacidad y seguridad

- No se muestran nombres reales de pacientes en la interfaz.
- No se exponen identificadores personales.
- No se publican datos sensibles en repositorios públicos.
- Los datos se anonimizan antes de su visualización.
- Se cumple con la Ley 1581 de 2012 (protección de datos personales).
- Se cumple con la Circular Externa 008 de 2018 y 017 de 2020 de la Superintendencia Nacional de Salud.
- Código y datos se separan claramente.

### RNF-03: Reproducibilidad

- Una persona externa debe poder ejecutar el pipeline completo de análisis.
- Cada paso debe quedar documentado.
- Las dependencias deben estar especificadas.
- Los datasets derivados deben generarse de forma reproducible.

### RNF-04: Accesibilidad

- Diseño responsive (desktop, tablet, mobile).
- Jerarquía visual clara.
- Tooltips informativos.
- Estados de carga.
- Estados vacíos (cuando no hay datos para un filtro).

### RNF-05: Mantenibilidad

- Código modular y legible.
- Tipado fuerte (TypeScript en frontend, Pydantic en backend).
- Sin duplicación innecesaria.
- Estructura de carpetas clara y convencional.

### RNF-06: Calidad del código

- Código documentado cuando sea necesario.
- Convenciones de nomenclatura consistentes.
- Commits descriptivos y atómicos.
- Separación de responsabilidades por capa.

---

## Requerimientos de datos

| Requisito | Descripción |
|-----------|-------------|
| Formato de entrada | CSV o Excel (según lo proporcionado por HeLi Salud IPS) |
| Variables mínimas esperadas | Tipo de PQRS, causa, canal de ingreso, servicio, fecha, estado, tiempo de respuesta |
| Variable opcional | Descripción textual de la PQRS (para análisis NLP) |
| Cantidad de registros | ~2,252 (censo del II semestre 2025) |
| Almacenamiento | `data/raw/` para originales, `data/processed/` para derivados |

---

## Requerimientos de tecnología

| Capa | Tecnología | Versión mínima |
|------|-----------|----------------|
| Análisis | Python | 3.10+ |
| Análisis | Pandas | 2.0+ |
| Análisis | Scikit-learn | 1.3+ |
| Análisis | kmodes | 0.12+ |
| Backend | FastAPI | 0.100+ |
| Backend | Pydantic | 2.0+ |
| Frontend | Angular | 17+ |
| Frontend | Tailwind CSS | 3.0+ |
| Frontend | Apache ECharts | 5.0+ |
| Frontend | TypeScript | 5.0+ |
| Control de versiones | Git | 2.0+ |
