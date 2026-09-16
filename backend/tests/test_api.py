"""Pruebas de la API HeLi Analytics.

Ejecutar con: python -X utf8 -m pytest backend/tests/ -v
Requiere: pip install pytest httpx  (httpx es necesario para TestClient de FastAPI)
"""

from fastapi.testclient import TestClient
from app.main import app, FRONTEND_DIR

client = TestClient(app)


# ── Raíz ──────────────────────────────────────────────────────────
def test_root():
    r = client.get("/")
    assert r.status_code == 200
    if (FRONTEND_DIR / "index.html").is_file():
        assert "text/html" in r.headers["content-type"]
    else:
        assert r.json()["app"] == "HeLi Analytics API"


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


# ── Resumen ───────────────────────────────────────────────────────
def test_resumen_total():
    data = client.get("/api/resumen").json()
    assert data["total_pqrs"] == 2251
    assert data["periodo"]["inicio"] == "2025-07-01"
    assert data["periodo"]["fin"] == "2025-12-31"


def test_resumen_metricas():
    data = client.get("/api/resumen").json()
    assert isinstance(data["tiempo_promedio_respuesta_dias"], float)
    assert isinstance(data["tiempo_mediana_respuesta_dias"], float)
    assert len(data["distribucion_tipo"]) >= 3


# ── Distribuciones ────────────────────────────────────────────────
def test_distribuciones_todas():
    data = client.get("/api/distribuciones").json()
    assert len(data["variables"]) >= 10


def test_distribucion_variable():
    data = client.get("/api/distribuciones/ambito").json()
    assert "frecuencias" in data
    assert len(data["frecuencias"]) >= 4


def test_distribucion_inexistente():
    r = client.get("/api/distribuciones/variable_falsa")
    assert r.status_code == 404


def test_temporal():
    data = client.get("/api/distribuciones/temporal").json()
    assert len(data["por_mes"]) == 6


def test_tiempo_respuesta():
    data = client.get("/api/distribuciones/tiempo-respuesta").json()
    assert data["media"] > 0
    assert len(data["distribucion_bins"]) >= 5
    assert len(data["por_ambito"]) >= 3
    assert len(data["por_area"]) >= 5


# ── Cruces ────────────────────────────────────────────────────────
def test_cruces():
    data = client.get("/api/cruces").json()
    assert len(data["cruces"]) >= 16


def test_cruce_por_variables():
    data = client.get("/api/cruces?variables=area_solicitud,canal").json()
    assert len(data["cruces"]) == 1


def test_cruce_inexistente():
    r = client.get("/api/cruces?variables=area_solicitud,regional")
    assert r.status_code == 404


# ── Clusters ──────────────────────────────────────────────────────
def test_clusters():
    data = client.get("/api/clusters").json()
    assert data["algoritmo"] == "K-Prototypes"
    assert data["num_clusters"] == 5
    assert len(data["clusters"]) == 5


def test_cluster_por_id():
    data = client.get("/api/clusters/0").json()
    assert data["id"] == 0
    assert "perfil" in data


def test_cluster_inexistente():
    r = client.get("/api/clusters/99")
    assert r.status_code == 404


# ── Insights ──────────────────────────────────────────────────────
def test_insights():
    data = client.get("/api/insights").json()
    assert len(data["insights"]) >= 5
    tipos = {i["tipo"] for i in data["insights"]}
    assert "hallazgo" in tipos


# ── Textual ───────────────────────────────────────────────────────
def test_textual():
    data = client.get("/api/textual").json()
    assert data["disponible"] is True
    assert "global" in data["top_palabras"]
    assert len(data["top_palabras"]["global"]) >= 10
    assert len(data["registros"]) >= 100


# ── Filtros ───────────────────────────────────────────────────────
def test_filtros():
    data = client.get("/api/filtros").json()

    assert len(data["tipos"]) >= 3
    assert {"RECLAMO", "PETICION", "QUEJA", "FELICITACION"} <= set(data["tipos"])
    assert len(data["ambitos"]) >= 3
    assert len(data["canales"]) >= 3
    assert len(data["areas"]) >= 5
    assert "clusters" not in data


# ── Registros ─────────────────────────────────────────────────────
def test_registros():
    data = client.get("/api/registros").json()
    assert len(data["registros"]) >= 2200
    r = data["registros"][0]
    assert "id" in r
    assert "tipo_pqrs_grupo" in r
    assert "dias_respuesta" in r