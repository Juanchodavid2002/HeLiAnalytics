"""Pruebas del endpoint /api/resumen."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_resumen_codigo_200():
    response = client.get("/api/resumen")
    assert response.status_code == 200


def test_resumen_total_pqrs():
    response = client.get("/api/resumen")
    data = response.json()
    assert data["total_pqrs"] == 2252


def test_resumen_periodo():
    data = client.get("/api/resumen").json()
    assert data["periodo"]["inicio"] == "2025-07-01"
    assert data["periodo"]["fin"] == "2025-12-31"


def test_resumen_claves_principales():
    data = client.get("/api/resumen").json()
    for clave in [
        "causa_mas_frecuente",
        "canal_mas_utilizado",
        "tiempo_promedio_respuesta_dias",
        "servicio_mas_pqrs",
    ]:
        assert clave in data