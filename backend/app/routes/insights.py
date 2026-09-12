"""Endpoint /api/insights: hallazgos automáticos del análisis."""

from fastapi import APIRouter

from app.config import cargar_json

router = APIRouter(prefix="/api", tags=["insights"])


@router.get("/insights")
def obtener_insights() -> dict:
    return cargar_json("insights.json")