"""Carga y perfilamiento del dataset BASE.xlsx de HeLi Salud IPS."""

from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_PATH = PROJECT_ROOT / "ProyectoDocumento" / "BASE.xlsx"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"


def load_raw() -> pd.DataFrame:
    """Carga el dataset original de PQRS.

    Returns:
        pd.DataFrame con los 2,261 registros de PQRS del II semestre 2025.
    """
    if not RAW_PATH.exists():
        raise FileNotFoundError(
            f"No se encontró el dataset en {RAW_PATH}. "
            "Verifique que BASE.xlsx esté en ProyectoDocumento/."
        )
    df = pd.read_excel(RAW_PATH)
    print(f"Dataset cargado: {df.shape[0]} filas × {df.shape[1]} columnas")
    return df


def profile(df: pd.DataFrame) -> pd.DataFrame:
    """Genera un perfil general del dataset.

    Returns:
        DataFrame con: nombre de columna, tipo, nulos, % nulos, únicos, ejemplos.
    """
    rows = []
    for col in df.columns:
        nulls = df[col].isna().sum()
        null_pct = (nulls / len(df)) * 100
        nunique = df[col].nunique(dropna=True)
        example = ""
        if nunique <= 8 and null_pct < 100:
            vals = df[col].dropna().unique().tolist()
            example = ", ".join(str(v) for v in vals[:8])
        else:
            sample = df[col].dropna().head(2).astype(str).tolist()
            example = " | ".join(s[:60] for s in sample)
        rows.append(
            {
                "columna": col,
                "tipo_dato": str(df[col].dtype),
                "nulos": int(nulls),
                "pct_nulos": round(null_pct, 1),
                "valores_unicos": int(nunique),
                "ejemplos": example,
            }
        )
    return pd.DataFrame(rows)