"""Punto de entrada de la API HeLi Analytics."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


if (FRONTEND_DIR / "index.html").is_file():
    app.frontend("/", directory=str(FRONTEND_DIR), fallback="index.html")
else:
    @app.get("/")
    def root() -> dict:
        return {
            "app": "HeLi Analytics API",
            "version": "1.0.0",
            "docs": "/docs",
        }


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}