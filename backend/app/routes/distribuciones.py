"""Endpoints /api/distribuciones*: distribuciones de frecuencias."""

from fastapi import APIRouter, HTTPException

from ..config import cargar_json

router = APIRouter(prefix="/api/distribuciones", tags=["distribuciones"])

_distribuciones = cargar_json("distribuciones.json")


@router.get("")
def obtener_distribuciones(variable: str | None = None) -> dict:
    if variable is None:
        return _distribuciones

    distribucion = next(
        (v for v in _distribuciones["variables"] if v["variable"] == variable), None
    )
    if distribucion is None:
        raise HTTPException(status_code=404, detail=f"Variable desconocida: {variable}")
    return {"variables": [distribucion]}


@router.get("/temporal")
def obtener_temporal() -> dict:
    return cargar_json("temporal.json")


@router.get("/tiempo-respuesta")
def obtener_tiempo_respuesta() -> dict:
    return cargar_json("tiempo_respuesta.json")


@router.get("/{variable}")
def obtener_distribucion(variable: str) -> dict:
    distribucion = next(
        (v for v in _distribuciones["variables"] if v["variable"] == variable), None
    )
    if distribucion is None:
        raise HTTPException(status_code=404, detail=f"Variable desconocida: {variable}")
    return distribucion