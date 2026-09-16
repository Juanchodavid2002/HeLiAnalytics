"""Punto de entrada de la API HeLi Analytics."""

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .routes import (
    resumen,
    distribuciones,
    cruces,
    clusters,
    insights,
    textual,
    filtros,
    registros,
)

app = FastAPI(
    title="HeLi Analytics API",
    description="API del Centro de Inteligencia de PQRS - HeLi Salud IPS",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:4300"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resumen.router)
app.include_router(distribuciones.router)
app.include_router(cruces.router)
app.include_router(clusters.router)
app.include_router(insights.router)
app.include_router(textual.router)
app.include_router(filtros.router)
app.include_router(registros.router)

FRONTEND_DIR = Path(__file__).resolve().parents[2] / "public"


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


def _servir_frontend(ruta_restante: str):
    """Sirve el SPA de Angular: archivos reales o fallback a index.html."""
    ruta_abs = (FRONTEND_DIR / ruta_restante).resolve()
    try:
        dentro = ruta_abs.is_relative_to(FRONTEND_DIR.resolve())
    except ValueError:
        dentro = False
    if ruta_restante and dentro and ruta_abs.is_file():
        return FileResponse(ruta_abs)
    return FileResponse(FRONTEND_DIR / "index.html")


if (FRONTEND_DIR / "index.html").is_file():
    @app.get("/{ruta_restante:path}", include_in_schema=False)
    def spa(ruta_restante: str) -> FileResponse:
        if ruta_restante.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")
        return _servir_frontend(ruta_restante)

else:
    @app.get("/")
    def root() -> dict:
        return {
            "app": "HeLi Analytics API",
            "version": "1.0.0",
            "docs": "/docs",
        }