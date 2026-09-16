"""Endpoint /api/registros: dataset analítico para KPIs filtrables en el frontend."""

from fastapi import APIRouter

from ..config import cargar_json

router = APIRouter(prefix="/api", tags=["registros"])

_registros = cargar_json("registros.json")


@router.get("/registros")
def obtener_registros() -> dict:
    """Devuelve el dataset analítico completo (sin texto libre).

    Se usa para calcular KPIs filtrables en el Dashboard y
    búsquedas en el módulo Textual.
    """
    return _registros
