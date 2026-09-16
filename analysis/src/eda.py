"""Análisis exploratorio de datos (EDA) y exportación de resultados JSON.

Genera los archivos JSON consumibles por la API FastAPI:
- resumen.json
- distribuciones.json
- cruces.json
- temporal.json
- insights.json
"""

import json
import re
from collections import Counter
from datetime import date
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
ANALYTIC_PATH = ROOT / "data" / "processed" / "pqrs_analitico_v2.csv"
OUT_DIR = ROOT / "backend" / "app" / "data"

# Variables categóricas de interés para distribuciones
# (sin causa/programa/sede: sus fuentes Clasificación/Programa/Sede ya no
# existen en BASE.xlsx tras la reducción documentada en docs/00 — D15/D16)
CATEGORICAS = [
    "tipo_pqrs",
    "tipo_pqrs_grupo",
    "canal",
    "area_solicitud",
    "ambito",
    "tipo_usuario",
    "regional",
    "vencimiento",
    "aseguradora",
    "mes",
]

# Análisis textual: stopwords en español + términos de cabecera del formato PQRS
# (se excluyen para que las nubes de palabras revelen el contenido real).
STOPWORDS = {
    "a", "al", "algo", "algún", "algunos", "ante", "antes", "aqui", "así", "aun",
    "aunque", "bajo", "bien", "cada", "casi", "como", "con", "contra", "cual",
    "cuales", "cualquier", "cuando", "cuanto", "da", "dan", "de", "del", "desde",
    "despues", "debe", "deben", "dice", "dicho", "donde", "dos", "el", "ella",
    "ellas", "ellos", "en", "entre", "era", "eran", "es", "esa", "esas", "ese",
    "eso", "esos", "esta", "estaba", "estar", "este", "esto", "estos", "etc", "fue",
    "fueron", "gustaria", "ha", "habia", "han", "hace", "hacer", "hacia", "hasta",
    "hay", "hecho", "hizo", "la", "las", "le", "les", "lo", "los", "mas", "me",
    "media", "mejor", "mes", "mientras", "mi", "mis", "mucho", "muy", "na", "nada",
    "ni", "no", "nos", "nosotros", "nuestra", "o", "otra", "otro", "para", "pero",
    "poca", "poco", "podria", "puede", "pueden", "que", "quien", "quiere", "se",
    "sea", "segun", "ser", "si", "sin", "sobre", "solo", "son", "su", "sus",
    "tal", "tambien", "tanto", "te", "tener", "tiene", "tienen", "todo", "todos",
    "tras", "tu", "un", "una", "uno", "unos", "usted", "va", "van", "veces", "ver",
    "vez", "y", "ya", "yo",
    "pqrs", "solicitud", "solicitudes", "radicado", "radicada", "reclamo", "queja",
    "peticion", "peticiones", "felicitacion", "felicitaciones", "reclamaciones",
    "usuario", "usuaria", "usuarios", "paciente", "pacientes", "señor", "señora",
    "doctor", "licenciada", "envia", "envian", "informa", "manifiesta", "manifiestan",
    "ips", "eps", "health", "life", "sas", "ltda", "saludocupacional",
}

TOKEN_RE = re.compile(r"[^a-záéíóúüñ0-9]+", re.IGNORECASE)

STOPWORDS_SET = {palabra.upper() for palabra in STOPWORDS}


def distribucion(df: pd.DataFrame, col: str) -> dict:
    """Frecuencias y porcentajes de una variable categórica."""
    vc = df[col].value_counts(dropna=False)
    total = vc.sum()
    return {
        "variable": col,
        "total": int(total),
        "frecuencias": [
            {
                "categoria": str(k) if not (isinstance(k, float) and np.isnan(k)) else "SIN DATO",
                "frecuencia": int(v),
                "porcentaje": round(float(v) / total * 100, 1),
            }
            for k, v in vc.items()
        ],
        "con_nulos": bool(df[col].isna().any()),
    }


def cruce(df: pd.DataFrame, x: str, y: str) -> dict:
    """Tabla cruzada entre dos variables categóricas."""
    ct = pd.crosstab(df[x], df[y])
    filas = []
    for i in ct.index:
        filas.append(
            {
                "x": i,
                "valores": [{"y": j, "frecuencia": int(ct.loc[i, j])} for j in ct.columns],
            }
        )
    return {"variable_x": x, "variable_y": y, "tabla": filas}


def tokenizar(texto: str) -> list[str]:
    """Tokeniza y filtra términos útiles para el análisis textual."""
    texto = texto.upper()
    tokens = TOKEN_RE.split(texto)
    return [t for t in tokens if len(t) >= 4 and t not in STOPWORDS_SET and not t.isdigit()]


def top_palabras(textos: list[str], n: int = 20) -> list[dict]:
    """Top n palabras más frecuentes de una lista de textos."""
    cont = Counter()
    for texto in textos:
        cont.update(tokenizar(texto))
    return [
        {"palabra": palabra, "frecuencia": freq}
        for palabra, freq in cont.most_common(n)
    ]


def tiempo_por_categoria(df: pd.DataFrame, col: str) -> list[dict]:
    """Estadísticas de tiempo de respuesta por categoría (mediana/media/% ≤ 30)."""
    filas = []
    for cat, sub in df.groupby(col):
        dias = sub["dias_respuesta"]
        filas.append(
            {
                "categoria": cat,
                "total": int(len(sub)),
                "media": round(float(dias.mean()), 1),
                "mediana": round(float(dias.median()), 1),
                "pct_menor_igual_30": round(float((dias <= 30).mean() * 100), 1),
            }
        )
    filas.sort(key=lambda r: r["total"], reverse=True)
    return filas


def eda(df: pd.DataFrame) -> dict:
    results = {}

# --- RESUMEN ---
    dist_tipo = {d["categoria"]: d["frecuencia"] for d in distribucion(df, "tipo_pqrs")["frecuencias"]}
    ambito_top = df["ambito"].value_counts().idxmax()
    canal_top = df["canal"].value_counts().idxmax()
    area_top = df["area_solicitud"].value_counts().idxmax()
    tipo_usuario_bins = df["tipo_usuario"].value_counts().idxmax()

    results["resumen"] = {
        "total_pqrs": int(len(df)),
        "periodo": {
            "inicio": str(df["fecha_reporte"].min().date()),
            "fin": str(df["fecha_reporte"].max().date()),
        },
        "distribucion_tipo": dist_tipo,
        "distribucion_tipo_grupo": {
            d["categoria"]: d["frecuencia"]
            for d in distribucion(df, "tipo_pqrs_grupo")["frecuencias"]
        },
        "ambito_mas_frecuente": {
            "categoria": ambito_top,
            "frecuencia": int(df["ambito"].value_counts().max()),
        },
        "canal_mas_utilizado": {
            "categoria": canal_top,
            "frecuencia": int(df["canal"].value_counts().max()),
        },
        "area_mas_frecuente": {
            "categoria": area_top,
            "frecuencia": int(df["area_solicitud"].value_counts().max()),
        },
        "tiempo_promedio_respuesta_dias": round(float(df["dias_respuesta"].mean()), 1),
        "tiempo_mediana_respuesta_dias": round(float(df["dias_respuesta"].median()), 1),
        "tipo_usuario_mas_frecuente": {
            "categoria": tipo_usuario_bins,
            "frecuencia": int(df["tipo_usuario"].value_counts().max()),
        },
    }

    # --- DISTRIBUCIONES ---
    results["distribuciones"] = {
        "variables": [distribucion(df, c) for c in CATEGORICAS]
    }

    # Estadísticas de tiempo de respuesta
    dias = df["dias_respuesta"]
    results["tiempo_respuesta"] = {
        "media": round(float(dias.mean()), 1),
        "mediana": round(float(dias.median()), 1),
        "desviacion": round(float(dias.std()), 1),
        "min": int(dias.min()),
        "max": int(dias.max()),
        "p25": round(float(dias.quantile(0.25)), 1),
        "p75": round(float(dias.quantile(0.75)), 1),
        "n_menor_igual_30": int((dias <= 30).sum()),
        "pct_menor_igual_30": round(float((dias <= 30).mean() * 100), 1),
        "distribucion_bins": [
            {"rango": "0-1 días", "frecuencia": int(((dias > -1) & (dias <= 1)).sum())},
            {"rango": "2-7 días", "frecuencia": int(((dias > 1) & (dias <= 7)).sum())},
            {"rango": "8-15 días", "frecuencia": int(((dias > 7) & (dias <= 15)).sum())},
            {"rango": "16-30 días", "frecuencia": int(((dias > 15) & (dias <= 30)).sum())},
            {"rango": "31-60 días", "frecuencia": int(((dias > 30) & (dias <= 60)).sum())},
            {"rango": "61-90 días", "frecuencia": int(((dias > 60) & (dias <= 90)).sum())},
            {"rango": "más de 90 días", "frecuencia": int((dias > 90).sum())},
        ],
        # Tiempo por categoría: alimenta Ámbito/Áreas sin repetir el gráfico global.
        "por_ambito": tiempo_por_categoria(df, "ambito"),
        "por_area": tiempo_por_categoria(df, "area_solicitud"),
    }

    # --- REGISTROS ANALÍTICOS (KPIs filtrables cliente-side, sin texto libre) ---
    registros = []
    cols_registro = [
        "fecha_reporte", "mes", "mes_num", "tipo_pqrs", "tipo_pqrs_grupo", "canal",
        "area_solicitud", "ambito", "tipo_usuario", "aseguradora", "regional",
        "vencimiento", "dias_respuesta",
    ]
    for i, (_, r) in enumerate(df[cols_registro].iterrows()):
        reg = {"id": i + 1}
        for col in cols_registro:
            v = r[col]
            if col == "fecha_reporte":
                v = str(pd.Timestamp(v).date())
            elif isinstance(v, float) and np.isnan(v):
                v = None
            reg[col] = v
        registros.append(reg)
    results["registros"] = {"registros": registros}

    # --- TEXTUAL (precomputado: sin exponer el texto crudo en el repositorio) ---
    textos = df["Hechos"].fillna("").astype(str).tolist()
    textual = {
        "disponible": True,
        "fecha_generacion": str(date.today()),
        "total_registros_con_texto": int((df["Hechos"].fillna("").astype(str) != "").sum()),
        "top_palabras": {
            "global": top_palabras(textos),
            "tipo": {
                str(g): top_palabras(sub["Hechos"].fillna("").astype(str).tolist())
                for g, sub in df.groupby("tipo_pqrs_grupo")
            },
            "ambito": {
                str(g): top_palabras(sub["Hechos"].fillna("").astype(str).tolist())
                for g, sub in df.groupby("ambito")
            },
            "area_solicitud": {
                str(g): top_palabras(sub["Hechos"].fillna("").astype(str).tolist())
                for g, sub in df.groupby("area_solicitud")
            },
        },
        "registros": [
            {
                "id": i + 1,
                "fecha_reporte": str(pd.Timestamp(r["fecha_reporte"]).date()),
                "mes": r["mes"],
                "mes_num": int(r["mes_num"]),
                "tipo_pqrs_grupo": r["tipo_pqrs_grupo"],
                "canal": r["canal"],
                "ambito": r["ambito"],
                "area_solicitud": r["area_solicitud"],
                "aseguradora": r["aseguradora"],
                "vencimiento": r["vencimiento"],
                "keywords": tokenizar(textos[i])[:12],
                "texto_preview": textos[i].strip().replace("\n", " ")[:90],
            }
            for i in range(len(df))
        ],
    }
    results["textual"] = textual

# --- CRUCES ---
    # Conjunto canónico de la reconfiguración (D16): solo variables disponibles.
    # Se incluyen pares en ambos órdenes porque /api/cruces iguala (x,y) exacto.
    cruces = [
        ("tipo_pqrs_grupo", "area_solicitud"),
        ("area_solicitud", "tipo_pqrs_grupo"),
        ("tipo_pqrs_grupo", "ambito"),
        ("ambito", "tipo_pqrs_grupo"),
        ("area_solicitud", "ambito"),
        ("ambito", "area_solicitud"),
        ("area_solicitud", "canal"),
        ("tipo_pqrs_grupo", "canal"),
        ("area_solicitud", "mes"),
        ("ambito", "canal"),
        ("canal", "mes"),
        ("tipo_usuario", "mes"),
        # Nuevos cruces (reconfiguración D17): temporal y cobertura.
        ("tipo_pqrs_grupo", "mes"),
        ("ambito", "mes"),
        ("aseguradora", "tipo_pqrs_grupo"),
        ("vencimiento", "mes"),
    ]
    results["cruces"] = {"cruces": [cruce(df, x, y) for x, y in cruces]}

    # --- TEMPORAL ---
    por_mes = df.groupby("mes_num").size().sort_index()
    por_mes_ext = df.groupby(["mes_num", "tipo_pqrs_grupo"]).size().unstack(fill_value=0)
    results["temporal"] = {
        "por_mes": [
            {"mes": nombres[int(i)], "mes_num": int(i), "cantidad": int(v)} for i, v in por_mes.items()
        ],
        "por_mes_tipo": [
            {
                "mes": nombres[int(i)],
                "mes_num": int(i),
                "tipos": {
                    str(col): int(por_mes_ext.loc[i, col])
                    for col in por_mes_ext.columns
                },
            }
            for i in por_mes_ext.index
        ],
    }

    return results


nombres = {7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"}


def generar_insights(df: pd.DataFrame, res: dict) -> list:
    """Genera insights automáticos basados exclusivamente en datos reales."""
    insights = []

    # 1. Tipo de PQRS dominante
    tipo = df["tipo_pqrs_grupo"].value_counts(normalize=True)
    tipo_top, tipo_pct = tipo.index[0], tipo.iloc[0] * 100
    insights.append(
        {
            "tipo": "hallazgo",
            "titulo": f"Predominancia de {tipo_top.title()}",
            "descripcion": (
                f"Las PQRS de tipo {tipo_top.title()} representan el {tipo_pct:.1f}% "
                f"de los registros analizados ({int(tipo.iloc[0] * len(df))} de {len(df)}), "
                "siendo la categoría predominante en el período."
            ),
            "metrica": f"{tipo_pct:.1f}%",
            "valor": tipo_top.title(),
            "orden": 1,
        }
    )

# 2. Ámbito más frecuente
    ambito = df["ambito"].value_counts(normalize=True)
    ambito_top, ambito_pct = ambito.index[0], ambito.iloc[0] * 100
    insights.append(
        {
            "tipo": "prioridad",
            "titulo": f"Ámbito predominante: {ambito_top.title()}",
            "descripcion": (
                f"El ámbito '{ambito_top.title()}' concentra el {ambito_pct:.1f}% de las PQRS "
                f"({int(ambito.iloc[0] * len(df))} registros). Es la principal línea de servicio "
                "en la que se concentra la inconformidad reportada por los usuarios."
            ),
            "metrica": f"{ambito_pct:.1f}%",
            "valor": ambito_top.title(),
            "orden": 2,
        }
    )

    # 3. Top 3 ámbitos
    ambito3 = ambito.head(3)
    suma3 = ambito3.sum() * 100
    insights.append(
        {
            "tipo": "hallazgo",
            "titulo": "Concentración de ámbitos",
            "descripcion": (
                f"Los 3 ámbitos más frecuentes ({', '.join(c.title() for c in ambito3.index)}) "
                f"concentran el {suma3:.1f}% de las PQRS analizadas."
            ),
            "metrica": f"{suma3:.1f}%",
            "valor": "Top 3 ámbitos",
            "orden": 3,
        }
    )

    # 4. Canal dominante
    canal = df["canal"].value_counts(normalize=True)
    canal_top, canal_pct = canal.index[0], canal.iloc[0] * 100
    insights.append(
        {
            "tipo": "hallazgo",
            "titulo": f"Canal de ingreso preferente: {canal_top.title()}",
            "descripcion": (
                f"El canal '{canal_top.title()}' concentra el {canal_pct:.1f}% de las radicaciones, "
                f"indicando que la institución debe priorizar la atención y gestión de este canal."
            ),
            "metrica": f"{canal_pct:.1f}%",
            "valor": canal_top.title(),
            "orden": 4,
        }
    )

    # 5. Tiempo de respuesta
    mediana = df["dias_respuesta"].median()
    p30 = (df["dias_respuesta"] <= 30).mean() * 100
    insights.append(
        {
            "tipo": "oportunidad",
            "titulo": "Tiempo de respuesta",
            "descripcion": (
                f"La mediana de respuesta es de {mediana:.0f} días y el {p30:.1f}% de las PQRS "
                "se respondieron en 30 días o menos, en línea con los estándares "
                "de la Circular 008 de 2018 de la Supersalud."
            ),
            "metrica": f"{mediana:.0f} días",
            "valor": f"{p30:.1f}% ≤ 30 días",
            "orden": 5,
        }
    )

# 6. Área de solicitud con mayor carga de PQRS
    area = df["area_solicitud"].value_counts(normalize=True)
    area_top6, area_pct = area.index[0], area.iloc[0] * 100
    insights.append(
        {
            "tipo": "oportunidad",
            "titulo": f"Área con mayor carga de PQRS: {area_top6.title()}",
            "descripcion": (
                f"El área de solicitud '{area_top6.title()}' acumula el {area_pct:.1f}% de las PQRS "
                f"({int(area.iloc[0] * len(df))} registros), siendo el principal foco "
                "de atención para gestiones de mejora."
            ),
            "metrica": f"{area_pct:.1f}%",
            "valor": area_top6.title(),
            "orden": 6,
        }
    )

    # 7. Mes con más PQRS
    mes = df.groupby("mes")["fecha_reporte"].count().sort_values(ascending=False)
    mes_top, mes_cnt = mes.index[0], mes.iloc[0]
    insights.append(
        {
            "tipo": "tendencia",
            "titulo": f"Mes pico: {mes_top.title()}",
            "descripcion": (
                f"{mes_top.title()} fue el mes con mayor radicación de PQRS ({mes_cnt} registros), "
                "posible foco de análisis sobre causas estacionales o eventos específicos."
            ),
            "metrica": str(mes_cnt),
            "valor": mes_top.title(),
            "orden": 7,
        }
    )

    # 8. Tipo de usuario dominante
    tu = df["tipo_usuario"].value_counts(normalize=True)
    tu_top, tu_pct = tu.index[0], tu.iloc[0] * 100
    insights.append(
        {
            "tipo": "hallazgo",
            "titulo": f"Perfil del radicador: {tu_top.title()}",
            "descripcion": (
                f"El {tu_pct:.1f}% de las PQRS son radicadas por {tu_top.title().lower().replace(' ', ' ')}, "
                "lo que orienta la estrategia de comunicación y seguimiento institucional."
            ),
            "metrica": f"{tu_pct:.1f}%",
            "valor": tu_top.title(),
            "orden": 8,
        }
    )

    return insights


def exportar(df: pd.DataFrame) -> None:
    results = eda(df)
    results["insights"] = {
        "insights": generar_insights(df, results),
        "fecha_generacion": str(date.today()),
        "total_registros_analizados": int(len(df)),
        "periodo": "II semestre 2025",
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    archivos = {
        "resumen.json": results["resumen"],
        "distribuciones.json": results["distribuciones"],
        "cruces.json": results["cruces"],
        "temporal.json": results["temporal"],
        "tiempo_respuesta.json": results["tiempo_respuesta"],
        "registros.json": results["registros"],
        "insights.json": results["insights"],
        "textual.json": results["textual"],
    }
    for nombre, data in archivos.items():
        (OUT_DIR / nombre).write_text(
            json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"  OK {nombre}")

    print(f"Exportados {len(archivos)} JSON a {OUT_DIR}")


if __name__ == "__main__":
    data = pd.read_csv(ANALYTIC_PATH, parse_dates=["fecha_reporte", "fecha_cierre"])
    print(f"Cargado: {data.shape}")
    exportar(data)
