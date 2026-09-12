# 02 — Problema y Objetivos

## Planteamiento del problema

Las Peticiones, Quejas, Reclamos y Sugerencias (PQRS) constituyen un mecanismo fundamental para evaluar la percepción de los usuarios frente a la calidad de los servicios de salud. En HeLi Salud IPS, institución orientada a la atención en salud mental, durante el segundo semestre de 2025 se registraron **2,252 PQRS**.

### Situación actual

Estos registros son utilizados principalmente para **responder solicitudes individuales**, sin aplicar procesos de análisis estructurado que permitan identificar:

- Patrones recurrentes en las inconformidades.
- Tendencias temporales.
- Relaciones entre variables asociadas a las PQRS.
- Causas prioritarias de mejora.

### Consecuencias

La ausencia de análisis estructurados limita la capacidad de la institución para:

1. Transformar datos disponibles en información estratégica.
2. Identificar tendencias y factores comunes de inconformidad.
3. Priorizar problemáticas relacionadas con la atención en salud mental.
4. Tomar decisiones basadas en evidencia para la mejora de procesos.
5. Generar estrategias focalizadas de mejora.
6. Reconocer grupos de comportamiento similares entre los usuarios.

### Justificación del enfoque analítico

Desde una perspectiva de analítica de datos, las PQRS representan registros estructurados que pueden ser transformados en información estratégica mediante técnicas de análisis descriptivo y segmentación. Esto permite:

- Identificar frecuencias y distribuciones.
- Reconocer patrones de comportamiento.
- Establecer relaciones entre variables.
- Generar conocimiento para la toma de decisiones.

---

## Pregunta de investigación

> ¿Cómo pueden las técnicas de análisis descriptivo y segmentación de datos aplicadas a los registros de PQRS de HeLi Salud IPS contribuir a la identificación de patrones de inconformidad y al reconocimiento de oportunidades de mejora en la atención de pacientes de salud mental durante el segundo semestre de 2025?

---

## Objetivos

### Objetivo general

Identificar patrones en las PQRS radicadas por pacientes de salud mental de HeLi Salud IPS, que permitan reconocer oportunidades de mejora en la atención, a partir de los datos recolectados durante el segundo semestre de 2025.

### Objetivos específicos

| # | Objetivo | Relación con el sistema HeLi Analytics |
|---|----------|----------------------------------------|
| OE1 | Describir las PQRS radicadas por pacientes de salud mental durante el segundo semestre de 2025, a partir de la consolidación y análisis exploratorio de la información según tipo, causa, canal de ingreso y servicio. | **Análisis descriptivo + Dashboard de distribuciones** |
| OE2 | Priorizar las causas más frecuentes de radicación de PQRS y su distribución dentro de la población analizada, con el fin de identificar problemáticas críticas relacionadas con la atención en salud mental. | **Análisis de frecuencias + Página de causas + Insights** |
| OE3 | Segmentar las PQRS en grupos con características similares a partir de variables asociadas a la causa, servicio, canal de ingreso y tiempo de respuesta, con el propósito de identificar patrones de comportamiento dentro de la población analizada. | **Clustering + Página de segmentación** |

---

## Justificación del proyecto

### Valor institucional

El valor del proyecto no se limita al análisis estadístico de las PQRS, sino a la generación de información estratégica que permita apoyar la toma de decisiones institucionales basadas en evidencia. A partir del análisis descriptivo y la segmentación de los registros, se espera:

- Identificar las causas más frecuentes de inconformidad.
- Reconocer patrones de comportamiento entre grupos de PQRS.
- Establecer criterios de priorización orientados al mejoramiento de la atención.
- Generar insumos analíticos: distribuciones de frecuencia, tipologías, agrupaciones y visualizaciones.

### Beneficiarios

| Tipo | Beneficiarios | Beneficio |
|------|--------------|-----------|
| Directo | HeLi Salud IPS y áreas de gestión de calidad | Información estructurada para evaluación y mejora |
| Indirecto | Pacientes de salud mental | Optimización de procesos de atención y experiencia del usuario |

### Viabilidad

El proyecto es viable debido a:

- Disponibilidad de los registros de PQRS del periodo de estudio (2,252 registros).
- Herramientas de analítica de datos accesibles (Python, bibliotecas open-source).
- Enfoque académico que permite desarrollo en el contexto de una especialización.

### Referentes académicos

El análisis de PQRS como herramienta de mejora ha sido respaldado por:

- Estudios de calidad en salud que utilizan quejas como indicadores (Salas, 2021; Pedraja et al., 2019; Romero, 2017).
- Investigaciones nacionales sobre percepción de calidad (Cataño et al., 2022; Bravo y Rueda, 2021).
- Aplicación de herramientas analíticas al sector salud (Torres et al., 2020; Retamoza et al., 2019).
- Marco teórico de modelos SERVQUAL, SERVPERF y enfoque de Donabedian.

---

## Limitaciones conocidas

1. El estudio es **transversal** (un solo periodo: II semestre 2025). No permite análisis de tendencias interanuales.
2. El diseño es **no experimental**. No se establecen relaciones de causalidad.
3. Se trabaja con **censo** (totalidad de registros), por lo que no se aplica inferencia estadística.
4. La segmentación identifica patrones de comportamiento, no causa-efecto.
5. Los resultados son específicos de HeLi Salud IPS y no son generalizables a otras instituciones sin validación.
