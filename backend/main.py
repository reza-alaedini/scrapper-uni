from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection
from scraper import scrape_divar
from contextlib import closing
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    with closing(get_connection()) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                price_number INTEGER,
                city TEXT,
                category TEXT,
                link TEXT UNIQUE,
                image_url TEXT
            )
        """)
        conn.commit()


def has_cached_ads(city: str, category: str) -> bool:
    with closing(get_connection()) as conn:
        row = conn.execute(
            "SELECT EXISTS(SELECT 1 FROM ads WHERE city=? AND category=? LIMIT 1)",
            (city, category),
        ).fetchone()
        return bool(row[0])


def replace_cached_ads(city: str, category: str, ads: list[dict], force: bool) -> None:
    with closing(get_connection()) as conn:
        try:
            # The write lock is acquired only for the short replace/insert operation.
            conn.execute("BEGIN IMMEDIATE")

            if force:
                conn.execute(
                    "DELETE FROM ads WHERE city=? AND category=?",
                    (city, category),
                )

            conn.executemany(
                """
                INSERT OR IGNORE INTO ads
                    (title, price_number, city, category, link, image_url)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        item["title"],
                        item["price_number"],
                        city,
                        category,
                        item["link"],
                        item["image_url"],
                    )
                    for item in ads
                ],
            )
            conn.commit()
        except Exception:
            conn.rollback()
            raise


def select_ads(
    city: str,
    category: str,
    min_price: int | None,
    max_price: int | None,
) -> list[dict]:
    query = "SELECT title, price_number, link, image_url FROM ads WHERE city=? AND category=?"
    params = [city, category]

    if min_price is not None:
        query += " AND price_number >= ?"
        params.append(min_price)

    if max_price is not None:
        query += " AND price_number <= ?"
        params.append(max_price)

    with closing(get_connection()) as conn:
        rows = conn.execute(query, params).fetchall()

    return [
        {"title": row[0], "price": row[1], "link": row[2], "image_url": row[3]}
        for row in rows
    ]


@app.get("/ads")
def get_ads(
    city: str,
    category: str,
    min_price: int = None,
    max_price: int = None,
    force: bool = False,
):
    cache_exists = has_cached_ads(city, category)

    if not cache_exists or force:
        # No SQLite connection is kept open while Playwright is running.
        new_data = scrape_divar(city, category, 20, min_price, max_price)

        if new_data:
            replace_cached_ads(city, category, new_data, force)
        else:
            logger.warning(
                "Scraper returned no ads for city=%s category=%s; existing cache was preserved.",
                city,
                category,
            )

    return select_ads(city, category, min_price, max_price)
