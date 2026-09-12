"""Endpoint /api/cruces: cruces de variables precomputados."""

from fastapi import APIRouter, HTTPException, Query

from app.config import cargar_json

router = APIRouter(prefix="/api/cruces", tags=["cruces"])

_cruces = cargar_json("cruces.json")


@router.get("")
def obtener_cruces(
    variables: str = Query(None, description="Par de variables separado por coma"),
) -> dict:
    if variables is None:
        return _cruces

    var_x, var_y = [v.strip() for v in variables.split(",")]
    cruce = next(
        (
            c
            for c in _cruces["cruces"]
            if (c["variable_x"] == var_x and c["variable_y"] == var_y)
        ),
        None,
    )
    if cruce is None:
        raise HTTPException(
            status_code=404,
            detail=f"Cruce no disponible: {var_x} × {var_y}",
        )
    return {"cruces": [cruce]}