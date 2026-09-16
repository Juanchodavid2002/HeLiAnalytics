"""Limpieza, estandarización y anonimización del dataset de PQRS (v2 — limpieza completa).

Genera el dataset analítico en data/processed/pqrs_analitico_v2.csv

Decisión de diseño:
- La variable "causa" corresponde a "Clasificación" (Circular 017/2020).
- El canal de ingreso es "Medio de Transmisión".
- El servicio está dado por "Programa" (el campo "Servicios" está vacío: solo
  contiene "SIN SERVICIOS" y "PRUEBA DE TIPO", columna de prueba a descartar).
- El tiempo de respuesta se calcula como (Fecha de Cierre - Fecha del Reporte) en días.

Esquema de entrada (BASE.xlsx reducido a 12 columnas, ver docs/00 D15):
- Se ELIMINARON las columnas "Código" y "Estado" por nula utilidad analítica
  (Estado era constante, Código era identificador interno).
- Las columnas "Programa", "Sede" y "Clasificación" ya no existen en la fuente,
  por lo que las variables derivadas programa/sede/causa se retiraron del
  dataset analítico. Pendiente: reconfigurar clustering.py y los JSON del
  backend con las variables disponibles.

Etapas de limpieza COMPLETA (v2) agregadas sobre la v1:
1. Deduplicación: se eliminan registros duplicados exactos (iguales en todas las
   columnas no textuales). Resultado: 2.261 -> 2.252 registros.
2. Unificación de categorías: variantes con/sin tilde se fusionan (CUCUTA -> CÚCUTA).
3. Imputación de nulos categóricos con la MODA de la columna (programa, ambito,
   aseguradora, regional, sede). Textos libres se rellenan con "" para NLP.
4. Tratamiento de outliers en dias_respuesta: winsorización al techo
   Q3 + 3*IQR (~29 días). Los valores originales se conservan en
   dias_respuesta_original y se marca es_outlier_respuesta.
"""

from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
RAW_PATH = ROOT / "ProyectoDocumento" / "BASE.xlsx"
OUT_DIR = ROOT / "data" / "processed"
OUT_PATH = OUT_DIR / "pqrs_analitico_v2.csv"

# Columnas con datos personales o identificadores directos (se eliminan)
COLUMNAS_SENSIBLES = [
    "Login",                     # Nombres de empleados
    "Reporta",                   # Persona que reporta (puede ser paciente/familiar)
    "Correo",                    # Correos electrónicos
    "Identificación del Paciente",  # Documentos de identidad
    "Nombre del Paciente",       # Nombres de pacientes
    "Guardián",                  # Nombres de personal/guardianes
    "Involucrados",              # Nombres de implicados
    "Archivos de PQRS",          # Nombres de archivos (contienen nombres)
]

# Columnas operativas/internas sin valor analítico directo
# (ya no existen en la fuente reducida a 12 columnas; se conservan por seguridad)
COLUMNAS_DESCARTADAS = [
    "ID",            # Identificador secuencial interno
    "Código",        # Código interno de radicación (eliminado del Excel, D15)
    "Servicios",     # Columna de prueba (SIN SERVICIOS / PRUEBA DE TIPO)
    "Fecha del Hecho",  # Fecha del hecho (no clave para el análisis; ya está la de reporte)
]

# Textos libres que se conservan en el dataset analítico SOLO para flag NLP.
# A la API solo llegan agregados (frecuencias de palabras), nunca el texto crudo.
COLUMNAS_TEXTO = [
    "Hechos",
    "Descripción",
    "Respuesta",
    "Respuesta de Involucrados",
]

# Renombres de columnas a nombres canónicos (ASCII para el stack de datos)
# Nota: Programa, Sede y Clasificación ya no existen en la fuente (D15).
RENAME = {
    "Fecha del Reporte": "fecha_reporte",
    "Mes": "mes",
    "Fecha de Cierre": "fecha_cierre",
    "Tipo de Solicitud": "tipo_pqrs",
    "Tipo de Usuario": "tipo_usuario",
    "Ámbito": "ambito",
    "Aseguradora": "aseguradora",
    "Regional": "regional",
    "Vencimiento": "vencimiento",
    "Área de Solicitud": "area_solicitud",
    "Medio de Transmisión": "canal",
}

# Orden final del dataset analítico (antes de agregar columnas de trazabilidad)
ORDEN_FINAL = [
    "fecha_reporte",
    "mes",
    "mes_num",
    "semana",
    "fecha_cierre",
    "dias_respuesta",
    "tipo_pqrs",
    "tipo_pqrs_grupo",
    "canal",
    "area_solicitud",
    "ambito",
    "tipo_usuario",
    "aseguradora",
    "regional",
    "vencimiento",
    "tiene_texto",
    "len_texto",
]

MES_NUM = {
    "JULIO": 7,
    "AGOSTO": 8,
    "SEPTIEMBRE": 9,
    "OCTUBRE": 10,
    "NOVIEMBRE": 11,
    "DICIEMBRE": 12,
}

# Se elimina la columna 'Descripción' porque es redundante/corta;
# nos quedamos con Hechos/Respuesta para NLP. (Decisión documentada.)
COLUMNAS_TEXTO_DESCARTADAS = ["Descripción"]

# Se agrega la variable tipo_pqrs_grupo para agrupar reclamos por riesgo
TIPO_GRUPO = {
    "PETICIÓN": "PETICION",
    "QUEJA": "QUEJA",
    "RECLAMO RIESGO SIMPLE": "RECLAMO",
    "RECLAMO RIESGO PRIORIZADO": "RECLAMO",
    "RECLAMO RIESGO VITAL": "RECLAMO",
    "FELICITACIÓN": "FELICITACION",
}

# Unificación de categorías con errores de tildes/capitalización (v2)
UNIFICAR_CATEGORIAS = {
    "area_solicitud": {"APLIACION DE MEDICAMENTO": "APLICACIÓN DE MEDICAMENTO"},
}

# Columnas categóricas con nulos que se imputarán con la moda (v2)
COLUMNAS_IMPUTAR_MODA = ["ambito", "aseguradora", "regional"]

# Columnas de texto que se rellenan con "" (sin NaN) para NLP (v2)
COLUMNAS_TEXTO_NLP = ["Hechos", "Respuesta", "Respuesta de Involucrados"]


def load_raw() -> pd.DataFrame:
    return pd.read_excel(RAW_PATH)


def _normalizar_texto(series: pd.Series) -> pd.Series:
    """Mayúsculas estables, sin espacios iniciales/finales y espacios colapsados."""
    return series.astype("string").str.strip().str.upper().str.replace(r"\s+", " ", regex=True)


def clean(df: pd.DataFrame, winsorizar: bool = True) -> pd.DataFrame:
    """Aplica limpieza, estandarización y anonimización completas (v2).

    Args:
        df: Dataset crudo de PQRS.
        winsorizar: Si True, winsoriza outliers de dias_respuesta (Q3 + 3*IQR).

    Returns:
        DataFrame analítico limpio y documentado en un atributo self.data.
    """
    d = df.copy()
    reporte: dict = {}

    # 1. Eliminar columnas sensibles y descartadas
    d = d.drop(columns=[c for c in COLUMNAS_SENSIBLES + COLUMNAS_DESCARTADAS if c in d.columns])

    # 2. Normalización de categorías y textos (todas las columnas de texto/objeto)
    for col in d.columns:
        if d[col].dtype in ("object", "str", "string"):
            d[col] = _normalizar_texto(d[col]).where(d[col].notna(), pd.NA)

    # 3. Renombrar a nombres canónicos
    d = d.rename(columns=RENAME)

    # 4. Fechas
    d["fecha_reporte"] = pd.to_datetime(d["fecha_reporte"], errors="coerce")
    d["fecha_cierre"] = pd.to_datetime(
        d["fecha_cierre"].str.split(" ").str[0], format="%Y-%m-%d", errors="coerce"
    )

    # 5. Tiempo de respuesta en días
    d["dias_respuesta"] = (d["fecha_cierre"] - d["fecha_reporte"]).dt.days

    # 6. Variables derivadas temporales
    d["mes_num"] = d["mes"].map(MES_NUM)
    d["semana"] = d["fecha_reporte"].dt.isocalendar().week.astype(int)

    # 7. Grupo de tipo de PQRS
    d["tipo_pqrs_grupo"] = d["tipo_pqrs"].map(TIPO_GRUPO)

    # 8. Indicadores de texto (NLP) - sin exponer contenido crudo
    d["tiene_texto"] = d["Hechos"].fillna("").astype(str).str.len() > 0
    d["len_texto"] = d["Hechos"].fillna("").astype(str).str.len()

    # 9. Orden final (columnas canónicas al frente, el resto al final)
    d = d[[c for c in ORDEN_FINAL if c in d.columns] + [c for c in d.columns if c not in ORDEN_FINAL]]
    d = d.drop(columns=COLUMNAS_TEXTO_DESCARTADAS, errors="ignore")

    # ── Limpieza COMPLETA (v2) ─────────────────────────────────────
    # 10. Unificar categorías mal escritas
    for col, mapeo in UNIFICAR_CATEGORIAS.items():
        if col in d.columns:
            d[col] = d[col].replace(mapeo)

    # 11. Deduplicación (excluyendo columnas de texto libre)
    cols_nodup = [c for c in d.columns if c not in COLUMNAS_TEXTO_NLP]
    mask_dup = d.duplicated(subset=cols_nodup, keep="first")
    reporte["duplicados_eliminados"] = int(mask_dup.sum())
    d = d[~mask_dup].reset_index(drop=True)

    # 12. Imputación de nulos categóricos con la moda
    reporte["nulos_imputados"] = {}
    for col in COLUMNAS_IMPUTAR_MODA:
        if col in d.columns and d[col].isna().any():
            moda = d[col].dropna().mode()
            if not moda.empty:
                reporte["nulos_imputados"][col] = int(d[col].isna().sum())
                d[col] = d[col].fillna(moda.iloc[0])

    # Textos sin NaN para NLP
    for col in COLUMNAS_TEXTO_NLP:
        if col in d.columns:
            reporte["nulos_imputados"][col] = int(d[col].isna().sum())
            d[col] = d[col].fillna("").astype(str)

    # 13. Outliers de dias_respuesta: winsorización al techo Q3 + 3*IQR
    d["dias_respuesta_original"] = d["dias_respuesta"]
    d["es_outlier_respuesta"] = False
    if winsorizar:
        q1, q3 = d["dias_respuesta"].quantile([0.25, 0.75])
        iqr = q3 - q1
        techo = q3 + 3 * iqr
        flag = d["dias_respuesta"] > techo
        reporte["outliers_winsorizados"] = int(flag.sum())
        reporte["techo_winsorizacion"] = round(float(techo), 2)
        d["es_outlier_respuesta"] = flag
        d.loc[flag, "dias_respuesta"] = techo

    d.attrs["clean_report"] = reporte
    return d


def main() -> None:
    raw = load_raw()
    print(f"Original: {raw.shape[0]} filas × {raw.shape[1]} columnas")

    analitico = clean(raw)
    r: dict = analitico.attrs["clean_report"]
    print(f"Analítico: {analitico.shape[0]} filas × {analitico.shape[1]} columnas")

    print("\n=== Informe de limpieza (v2) ===")
    print(f"   Duplicados eliminados   : {r['duplicados_eliminados']}")
    print(f"   Nulos imputados         : {sum(r['nulos_imputados'].values())} "
          f"({', '.join(f'{k}: {v}' for k, v in r['nulos_imputados'].items())})")
    outl = r.get("outliers_winsorizados", 0)
    print(f"   Outliers winsorizados   : {outl} "
          f"(techo Q3+3*IQR = {r.get('techo_winsorizacion', '-')} días)")
    print(f"   REGISTROS FINALES       : {len(analitico)}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    analitico.to_csv(OUT_PATH, index=False, encoding="utf-8-sig")
    print(f"\nGuardado en: {OUT_PATH}")


if __name__ == "__main__":
    main()