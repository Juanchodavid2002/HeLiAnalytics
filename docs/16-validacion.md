# 16 — Validación

## Objetivo

Verificar que cada componente del sistema funciona correctamente y que los resultados son consistentes con los datos de entrada.

---

## Checklist de validación por capa

### Capa de datos

| # | Criterio | Método | Estado |
|---|----------|--------|--------|
| D1 | El dataset fue cargado correctamente | Verificar shape, dtypes, head | [ ] |
| D2 | No hay filas completamente vacías | `df.isnull().all(axis=1).sum() == 0` | [ ] |
| D3 | Los duplicados fueron removidos | `df.duplicated().sum() == 0` | [ ] |
| D4 | Los nulos fueron tratados según estrategia documentada | Revisar porcentaje de nulos post-limpieza | [ ] |
| D5 | Las categorías están estandarizadas | Verificar valores únicos por columna categórica | [ ] |
| D6 | Los tipos de datos son correctos | `df.dtypes` | [ ] |
| D7 | Las fechas están en rango correcto | Verificar julio-diciembre 2025 | [ ] |
| D8 | El dataset analítico fue exportado | Verificar existencia de `data/processed/pqrs_analitico_v2.csv` | [ ] |
| D9 | El diccionario de datos fue actualizado | Verificar `docs/04-datos-y-diccionario.md` | [ ] |

### Capa de análisis (EDA)

| # | Criterio | Método | Estado |
|---|----------|--------|--------|
| E1 | Frecuencias calculadas para todas las variables categóricas | Revisar notebook | [ ] |
| E2 | Estadísticas calculadas para variables numéricas | Revisar notebook | [ ] |
| E3 | Al menos 5 cruces realizados | Revisar notebook | [ ] |
| E4 | Distribución temporal calculada | Revisar notebook | [ ] |
| E5 | Cada gráfico tiene título y etiquetas | Revisar visualizaciones | [ ] |
| E6 | Resultados exportados a JSON | Verificar archivos en `backend/app/data/` | [ ] |
| E7 | Los porcentajes suman ~100% | Verificar distribuciones | [ ] |
| E8 | Los totales coinciden con el dataset | `total_pqrs == len(df)` | [ ] |

### Capa de clustering

| # | Criterio | Método | Estado |
|---|----------|--------|--------|
| C1 | El número de clusters está justificado | Revisar método del codo y silueta | [ ] |
| C2 | Cada cluster tiene > 5% de los registros | Verificar distribución | [ ] |
| C3 | Cada cluster tiene un perfil interpretable | Revisar interpretación | [ ] |
| C4 | Los clusters tienen nombres descriptivos | Revisar resultados | [ ] |
| C5 | Las métricas de calidad están documentadas | Revisar costo y silueta | [ ] |
| C6 | Resultados exportados a JSON | Verificar `clusters.json` | [ ] |

### Capa de API

| # | Criterio | Método | Estado |
|---|----------|--------|--------|
| A1 | GET /api/resumen retorna KPIs correctos | Curl o Swagger | [ ] |
| A2 | GET /api/distribuciones retorna todas las distribuciones | Curl o Swagger | [ ] |
| A3 | GET /api/distribuciones/temporal retorna serie temporal | Curl o Swagger | [ ] |
| A4 | GET /api/cruces con parámetros válidos retorna cruce | Curl o Swagger | [ ] |
| A5 | GET /api/clusters retorna clusters correctos | Curl o Swagger | [ ] |
| A6 | GET /api/clusters/{id} retorna perfil detallado | Curl o Swagger | [ ] |
| A7 | GET /api/insights retorna insights generados | Curl o Swagger | [ ] |
| A8 | GET /api/filtros retorna valores disponibles | Curl o Swagger | [ ] |
| A9 | CORS configurado para Angular | Probar desde frontend | [ ] |
| A10 | Respuestas en menos de 500ms | Medir tiempo de respuesta | [ ] |
| A11 | Documentación Swagger accesible | Abrir /docs | [ ] |
| A12 | Errores retornan códigos HTTP correctos | Probar parámetros inválidos | [ ] |

### Capa de frontend

| # | Criterio | Método | Estado |
|---|----------|--------|--------|
| F1 | Dashboard carga correctamente | Abrir en navegador | [ ] |
| F2 | KPIs muestran valores correctos | Comparar con API | [ ] |
| F3 | Gráficos muestran datos correctos | Comparar con API | [ ] |
| F4 | Filtros actualizan los gráficos | Cambiar filtros, verificar | [ ] |
| F5 | Sidebar navega a todas las páginas | Click en cada enlace | [ ] |
| F6 | Página de Tendencias funcional | Verificar gráficos temporales | [ ] |
| F7 | Página de Causas funcional | Verificar ranking y cruces | [ ] |
| F8 | Página de Servicios funcional | Verificar distribución por servicio | [ ] |
| F9 | Página de Segmentación funcional | Verificar clusters y perfil | [ ] |
| F10 | Página de Insights funcional | Verificar cards de insights | [ ] |
| F11 | Página de Textual funcional (si aplica) | Verificar análisis de texto | [ ] |
| F12 | Responsive en desktop | Probar en > 1024px | [ ] |
| F13 | Responsive en tablet | Probar en 768-1024px | [ ] |
| F14 | Responsive en mobile | Probar en < 768px | [ ] |
| F15 | Estados de carga visibles | Verificar skeleton/spinner | [ ] |
| F16 | Estado vacío funcional | Aplicar filtro sin resultados | [ ] |

---

## Validación cruzada

### Datos vs. API

| Verificación | Método |
|-------------|--------|
| Total PQRS en dashboard = Total en dataset | Comparar `resumen.total_pqrs` con `len(df)` |
| Distribución por tipo = Frecuencias reales | Comparar `distribuciones.tipo_pqrs` con `df.tipo_pqrs.value_counts()` |
| Causa más frecuente = Moda real | Comparar `resumen.causa_mas_frecuente` con `df.causa.mode()` |

### API vs. Frontend

| Verificación | Método |
|-------------|--------|
| KPIs del dashboard = Respuesta de /api/resumen | Inspeccionar network tab |
| Gráficos = Datos de /api/distribuciones | Inspeccionar network tab |
| Filtros = Parámetros en la request | Inspeccionar network tab |

### Análisis vs. Resultados

| Verificación | Método |
|-------------|--------|
| Cluster count en JSON = Cluster count en frontend | Comparar |
| Interpretación de clusters = Perfil real | Verificar coherencia |
| Insights = Datos reales | Verificar que cada insight tiene métrica respaldada |

---

## Pruebas de rendimiento

| Criterio | Objetivo | Método |
|----------|----------|--------|
| Carga del dashboard | < 3 segundos | Medir en DevTools Network |
| Respuesta de filtros | < 1 segundo | Medir en DevTools Network |
| Respuesta de API | < 500ms | Medir tiempo de respuesta |
| Tamaño del bundle Angular | < 2MB | `ng build --stats-json` |

---

## Informe de validación

Al finalizar la validación, generar un informe con:

```markdown
## Informe de Validación — HeLi Analytics

### Resumen
- Total de criterios evaluados: XX
- Criterios aprobados: XX
- Criterios con observaciones: XX
- Criterios no aprobados: XX

### Estado general
[APROBADO / CON OBSERVACIONES / NO APROBADO]

### Observaciones
- [Lista de observaciones si las hay]

### Próximos pasos
- [Acciones correctivas si las hay]
```
