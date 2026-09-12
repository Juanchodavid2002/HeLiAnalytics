"""Endpoints /api/clusters*: resultados del clustering K-Prototypes."""

from fastapi import APIRouter, HTTPException

from app.config import cargar_json

router = APIRouter(prefix="/api/clusters", tags=["clusters"])

_clusters = cargar_json("clusters.json")


@router.get("")
def obtener_clusters() -> dict:
    return _clusters


@router.get("/{cluster_id}")
def obtener_cluster(cluster_id: int) -> dict:
    cluster = next(
        (c for c in _clusters["clusters"] if c["id"] == cluster_id), None
    )
    if cluster is None:
        raise HTTPException(status_code=404, detail=f"Cluster no existe: {cluster_id}")
    return cluster