import os
import sqlite3
from pathlib import Path


DEFAULT_DB_PATH = Path(__file__).resolve().with_name("ads.db")

DB_PATH = Path(
    os.getenv("DB_PATH", str(DEFAULT_DB_PATH))
)


def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(
        DB_PATH,
        timeout=30,
    )

    conn.execute("PRAGMA busy_timeout = 30000")

    return conn