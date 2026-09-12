"""Configuración general de la API HeLi Analytics."""

import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / "data"


def cargar_json(nombre: str) -> dict:
    """Carga un JSON del directorio de datos garantizando codificación UTF-8."""
    with open(DATA_DIR / nombre, "r", encoding="utf-8") as f:
        return json.load(f)