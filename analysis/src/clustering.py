"""Segmentación de PQRS mediante K-Prototypes.

Procedimiento (documentado para el informe académico):
  1. Selección de variables.
     - Categóricas (4): tipo_pqrs_grupo, causa, canal, programa.
     - Numérica (1): dias_respuesta (se escaló min-max a [0,1]).
  2. Algoritmo: K-Prototypes (Huang) con gamma=1.0, init='Cao', n_init=5.
     - K-Means estándar se descarta: codificar las categóricas con one-hot +
       K-Means asume variables numéricas continuas y distancias euclidianas
       donde la categoría "no presente" tiene peso lineal, no apropiado para
       atributos nominales (ver 00-informe-decisiones, D7).
     - K-Modes (solo categóricas) se descartó porque el objetivo OE3 exige
       incluir el tiempo de respuesta como variable de segmentación.
  3. Selección de k = 5 (método del codo + balance + interpretabilidad):
     - El costo cae monótonamente con k; el último salto sustantivo se da en
       k=5 (13% costo), luego la ganancia marginal se reduce (~9.5%).
     - A k=5 los cinco segmentos son balanceados (12%–28%) y cada uno tiene
       un perfil dominante distinto (tipo de PQRS, canal y servicio).
     - El coeficiente de silueta (Hamming) en espacio puramente categórico
       es negativo por el efecto de modas dominantes (causa=CONTINUIDAD 68%),
       situación conocida en datos categóricos sesgados; se reporta como
       limitación, no se usa como criterio excluyente.
  4. Interpretación: perfil por segmento (modas + top-5 + media/mediana de
     dias_respuesta) y nombre descriptivo generado.

Salidas:
  - backend/app/data/clusters.json      → tabla consolidada para la API.
  - data/processed/pqrs_cluster_v1.csv  → dataset analítico + columna cluster.
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd
from kmodes.kprototypes import KPrototypes

ROOT = Path(__file__).resolve().parents[2]
ANALYTIC_PATH = ROOT / "data" / "processed" / "pqrs_analitico_v2.csv"
OUT_DIR = ROOT / "backend" / "app" / "data"
CLUSTERED_PATH = ROOT / "data" / "processed" / "pqrs_cluster_v2.csv"

cat_vars = ["tipo_pqrs_grupo", "causa", "canal", "programa"]
num_vars = ["dias_respuesta"]
K_ELEGIDO = 5


def preparar_matriz(df: pd.DataFrame) -> tuple[np.ndarray, list[int], np.ndarray]:
    """Construye la matriz para K-Prototypes (categóricas + numérica escalada)."""
    Xcat = df[cat_vars].astype(str).to_numpy().astype(object)
    for i, col in enumerate(cat_vars):
        moda = df[col].mode().iloc[0]
        mask = pd.isna(Xcat[:, i]) | (Xcat[:, i] == "")
        Xcat[mask, i] = str(moda)

    dr = df[num_vars[0]].fillna(df[num_vars[0]].median()).to_numpy(dtype=float)
    dr_scaled = (dr - dr.min()) / (dr.max() - dr.min())  # min-max [0,1]

    X = np.column_stack([Xcat, dr_scaled])
    cat_idx = list(range(len(cat_vars)))
    return X, cat_idx, dr


def silueta_hamming(Xcat_only: np.ndarray, labels: np.ndarray) -> float:
    """Silueta con distancia de Hamming (matriz precomputada), muestra de 400."""
    from sklearn.metrics import silhouette_score

    rng = np.random.RandomState(42)
    idx = rng.choice(len(Xcat_only), size=min(400, len(Xcat_only)), replace=False)
    Xc = Xcat_only[idx].astype(object)
    dm = (Xc[:, None, :] != Xc[None, :, :]).mean(axis=2)
    return silhouette_score(dm, labels[idx], metric="precomputed")


def evaluar_k(df: pd.DataFrame, k_range=range(2, 8)) -> list[dict]:
    """Tabla k vs costo/silueta/balance para justificar la elección de k."""
    X, cat_idx, _ = preparar_matriz(df)
    resultados = []
    for k in k_range:
        km = KPrototypes(
            n_clusters=k, init="Cao", n_init=3, random_state=42, verbose=0, gamma=1.0
        )
        labels = km.fit_predict(X, categorical=cat_idx)
        tam = [int((labels == c).sum()) for c in range(k)]
        cv = float(np.std(tam) / np.mean(tam))  # coeficiente de variación de tamaños
        sil = silueta_hamming(X[:, cat_idx], labels)
        resultados.append(
            {
                "k": k,
                "costo": round(float(km.cost_), 2),
                "silueta": round(sil, 4),
                "cv_tamanos": round(cv, 3),
                "tamanos": tam,
            }
        )
        print(
            f"k={k}: costo={km.cost_:.0f}, silueta={sil:.4f}, "
            f"cv={cv:.3f}, tamanos={tam}",
            flush=True,
        )
    return resultados


def entrenar(df: pd.DataFrame, k: int):
    X, cat_idx, _ = preparar_matriz(df)
    km = KPrototypes(
        n_clusters=k, init="Cao", n_init=5, random_state=42, verbose=0, gamma=1.0
    )
    labels = km.fit_predict(X, categorical=cat_idx)
    return km, labels, X, cat_idx


def interpretar_cluster(df: pd.DataFrame, labels: np.ndarray, k: int) -> list[dict]:
    dfc = df.copy()
    dfc["cluster"] = labels
    clusters = []
    for cid in range(k):
        sub = dfc[dfc["cluster"] == cid]
        size = len(sub)
        pct = size / len(dfc) * 100

        perfil = {}
        for var in cat_vars:
            vc = sub[var].value_counts(normalize=True)
            vc = vc[vc.index != "nan"]
            perfil[var] = {
                "moda": str(vc.index[0]),
                "pct_moda": round(float(vc.iloc[0] * 100), 1),
                "top": [
                    {"categoria": str(i), "porcentaje": round(float(v) * 100, 1)}
                    for i, v in vc.head(5).items()
                ],
            }
        perfil[num_vars[0]] = {
            "media": round(float(sub[num_vars[0]].mean()), 1),
            "mediana": round(float(sub[num_vars[0]].median()), 1),
        }

        clusters.append(
            {
                "id": int(cid),
                "cantidad": int(size),
                "participacion_pct": round(float(pct), 1),
                "perfil": perfil,
                "nombre": "",
                "interpretacion": "",
            }
        )
    return clusters


def asignar_nombres(clusters: list[dict], df: pd.DataFrame, labels: np.ndarray) -> list[dict]:
    dfc = df.copy()
    dfc["cluster"] = labels
    letras = ["A", "B", "C", "D", "E", "F", "G"]
    for c in clusters:
        cid = c["id"]
        sub = dfc[dfc["cluster"] == cid]
        p = c["perfil"]
        tipo = p["tipo_pqrs_grupo"]["moda"].title()
        causa = p["causa"]["moda"].title()
        canal = p["canal"]["moda"].title()
        progra = p["programa"]["moda"].title()
        med = p["dias_respuesta"]["mediana"]
        c["letra"] = letras[cid]
        c["nombre"] = f"{tipo} · {causa} · {canal}"
        c["interpretacion"] = (
            f"Segmento dominado por {tipo.lower()}s ({p['tipo_pqrs_grupo']['pct_moda']}%), "
            f"causa {causa.lower()} ({p['causa']['pct_moda']}%), canal {canal.lower()} "
            f"({p['canal']['pct_moda']}%) y servicio {progra.lower()} "
            f"({p['programa']['pct_moda']}%). Representa {c['participacion_pct']}% de las PQRS "
            f"({c['cantidad']} registros); respuesta mediana de {med} días."
        )
    return clusters


def exportar(df: pd.DataFrame, k: int) -> None:
    km, labels, X, cat_idx = entrenar(df, k)
    clusters = interpretar_cluster(df, labels, k)
    clusters = asignar_nombres(clusters, df, labels)

    resultado = {
        "algoritmo": "K-Prototypes",
        "num_clusters": k,
        "gamma": 1.0,
        "variables_categoricas": cat_vars,
        "variables_numericas": [f"{num_vars[0]} (escalada min-max)"],
        "criterio_seleccion_k": (
            "Método del codo (último salto sustantivo de costo en k=5), "
            "tamaños de segmento balanceados (CV más bajo) e interpretabilidad "
            "de los perfiles. La silueta Hamming (categórico) se reporta como "
            "limitación por modas dominantes de las variables."
        ),
        "metricas": {
            "costo_total": round(float(km.cost_), 2),
        },
        "clusters": clusters,
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "clusters.json").write_text(
        json.dumps(resultado, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    dfc = df.copy()
    dfc["cluster"] = labels
    dfc.to_csv(CLUSTERED_PATH, index=False, encoding="utf-8-sig")

    print("\nClusters exportados -> backend/app/data/clusters.json")
    print("Dataset etiquetado  -> data/processed/pqrs_cluster_v2.csv")
    for c in clusters:
        print(
            f"  Cluster {c['letra']} ({c['participacion_pct']}%): "
            f"{c['nombre']} | mediana {c['perfil']['dias_respuesta']['mediana']} días"
        )


if __name__ == "__main__":
    data = pd.read_csv(ANALYTIC_PATH, parse_dates=["fecha_reporte", "fecha_cierre"])
    print(f"Cargado: {data.shape}")

    print("\n=== Evaluación del número de clusters (k) ===")
    evaluar_k(data)

    print(f"\n=== Entrenamiento final k={K_ELEGIDO} ===")
    exportar(data, k=K_ELEGIDO)