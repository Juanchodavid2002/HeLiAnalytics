# Datos

## Estructura

```
data/
├── raw/          # Datos originales proporcionados por HeLi Salud IPS
├── processed/    # Datos derivados del análisis y limpieza
└── README.md     # Este archivo
```

## Reglas

1. **Nunca modificar archivos en `raw/`**. Estos son los datos originales.
2. Los archivos procesados se guardan en `processed/` con nombre descriptivo y versión.
3. Los datos sensibles NO se suben al repositorio público.

## Formato esperado

| Ubicación | Formato | Contenido |
|-----------|---------|-----------|
| `raw/` | CSV o Excel | Dataset original de PQRS |
| `processed/` | CSV | Dataset limpio y estandarizado |

## Obtención de datos

El dataset de PQRS debe ser proporcionado por HeLi Salud IPS.

**Contacto:** [PENDIENTE DE DEFINIR]

**Periodo:** Segundo semestre de 2025 (julio - diciembre)

**Volumen esperado:** ~2,252 registros

## Cambios

Ver `processed/CHANGELOG.md` para el historial de versiones del dataset procesado.
