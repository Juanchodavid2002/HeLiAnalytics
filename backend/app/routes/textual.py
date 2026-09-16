"""Endpoint /api/textual: análisis textual de PQRS (marca: activado según data)."""

from fastapi import APIRouter

from ..config import cargar_json

router = APIRouter(prefix="/api", tags=["textual"])


_textual = cargar_json("textual.json")


@router.get("/textual")
def obtener_textual() -> dict:
    """Devuelve el análisis textual precomputado (top palabras, registros con keywords)."""
    return _textual