"""Endpoint /api/resumen: KPIs generales del dashboard."""

from fastapi import APIRouter

from app.config import cargar_json

router = APIRouter(prefix="/api", tags=["resumen"])


@router.get("/resumen")
def obtener_resumen() -> dict:
    return cargar_json("resumen.json")