"""Endpoint /api/filtros: valores disponibles para los filtros del dashboard."""

from fastapi import APIRouter

from ..config import cargar_json

router = APIRouter(prefix="/api", tags=["filtros"])

_distribuciones = cargar_json("distribuciones.json")
_temporal = cargar_json("temporal.json")
_clusters = cargar_json("clusters.json")


def _categorias(variable: str) -> list[str]:
    d = next((v for v in _distribuciones["variables"] if v["variable"] == variable), None)
    if d is None:
        return []
    return [f["categoria"] for f in d["frecuencias"]]


@router.get("/filtros")
def obtener_filtros() -> dict:
    return {
        "tipos": _categorias("tipo_pqrs"),
        "causas": _categorias("causa"),
        "canales": _categorias("canal"),
        "servicios": _categorias("programa"),
        "meses": [
            {m["mes_num"]: m["mes"]} for m in _temporal["por_mes"]
        ],
        "clusters": [
            {"id": c["id"], "letra": c["letra"], "nombre": c["nombre"], "cantidad": c["cantidad"]}
            for c in _clusters["clusters"]
        ],
    }