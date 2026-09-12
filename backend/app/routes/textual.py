"""Endpoint /api/textual: análisis textual de PQRS (marca: activado según data)."""

from fastapi import APIRouter

from ..config import cargar_json

router = APIRouter(prefix="/api", tags=["textual"])


@router.get("/textual")
def obtener_textual() -> dict:
    """Devuelve los indicadores textuales disponibles del dataset analítico.

    El análisis NLP profundo se documenta como pendiente en
    docs/06-eda.md; aquí se exponen solo métricas de cobertura de texto
    calculadas en el EDA (ver temporal.json/insights.json).
    """
    return {
        "disponible": False,
        "detalle": (
            "El análisis textual (heurísticos sobre lenguaje natural, MCA, "
            "LDA, etc.) está pendiente de definición. Los indicadores "
            "estructurales (tiene_texto, len_texto) están en el dataset."
        ),
    }