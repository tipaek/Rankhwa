"""
Seed Rankhwa DB from AniList with genres support.
Usage:
  DB_URL=postgres://user:pass@host/db python tools/seed/anilist_seed.py
"""

import os, requests, time
import psycopg as psycopg
from dotenv import load_dotenv
import json
import calendar, datetime

load_dotenv(dotenv_path="rankhwa-backend/.env")
db_url = os.environ["SPRING_DATASOURCE_SEED_URL"]

GRAPHQL = """
query ($page:Int,$perPage:Int){
  Page(page:$page, perPage:$perPage){
    media(type:MANGA, countryOfOrigin:"KR", sort:POPULARITY_DESC){
      id
      title { romaji english native userPreferred }
      description(asHtml:false)
      averageScore
      popularity
      startDate { year month day }
      coverImage { extraLarge }
      bannerImage
      chapters
      genres
      isAdult                      # <-- add
      tags { name isAdult }        # <-- add
      staff(sort:RELEVANCE, perPage:1){
        nodes { name { full } }
      }
    }
  }
}
"""


THRESHOLD = int(os.getenv("POPULATION_THRESHOLD", 100))
PAGE_SIZE  = 50

BANNED_GENRES = {
    "Hentai", "Smut", "Erotica", "Ecchi",
    "Yaoi", "Yuri", "Steamy", "BL", "GL", "Adult"
}

def preferred_title(t):
    return (
        t.get("english")
        or t.get("romaji")
        or t.get("native")
        or t.get("userPreferred")
        or "Untitled"
    )

def first_author(m: dict) -> str | None:
    nodes = m.get("staff", {}).get("nodes")
    return nodes[0]["name"]["full"] if nodes else None

def safe_date(y, m, d):
    if not y:
        return None
    m = m or 1
    d = d or 1
    d = min(d, calendar.monthrange(y, m)[1])
    return datetime.date(y, m, d)

def upsert(cur: psycopg.Cursor, m: dict, page: int):
    t = m["title"]
    author = first_author(m)
    desc = (m.get("description") or "").replace("\r", " ").replace("\t", " ")
    genres = m.get("genres") or []
    if not isinstance(genres, list):
        genres = []

    cur.execute(
        """
        INSERT INTO manhwa (
            anilist_id, title, titles, title_native, title_english,
            author, description,
            avg_rating, vote_count,
            cover_url, banner_url, chapters,           -- NEW
            release_date, seed_popularity,
            genres
        )
        VALUES (%(id)s, %(title)s, %(titles)s::jsonb, %(native)s, %(english)s,
                %(author)s, %(desc)s,
                %(avg)s, %(pop)s,
                %(cover)s, %(banner)s, %(chapters)s,   -- NEW
                %(reldate)s, %(pop)s,
                %(genres)s::jsonb)
        ON CONFLICT (anilist_id) DO UPDATE
          SET title_native  = COALESCE(EXCLUDED.title_native,  manhwa.title_native),
              title_english = COALESCE(EXCLUDED.title_english, manhwa.title_english),
              banner_url    = COALESCE(EXCLUDED.banner_url,    manhwa.banner_url), -- NEW
              chapters      = COALESCE(EXCLUDED.chapters,      manhwa.chapters),   -- NEW
              genres        = EXCLUDED.genres
        """,
        dict(
            id=m["id"],
            title=preferred_title(t),
            titles=json.dumps(t),
            native=t.get("native"),
            english=t.get("english"),
            author=author,
            desc=desc,
            avg=(m.get("averageScore") or 0) / 10,
            pop=m.get("popularity") or 0,
            cover=m["coverImage"]["extraLarge"],
            banner=m.get("bannerImage"),                        # NEW
            chapters=m.get("chapters"),                         # NEW
            reldate=safe_date(
                m["startDate"]["year"],
                m["startDate"]["month"],
                m["startDate"]["day"],
            ),
            genres=json.dumps(genres or []),
        ),
    )


def passes_filters(m: dict) -> bool:
    if m.get("isAdult"):
        return False
    if any(g in BANNED_GENRES for g in m.get("genres", [])):
        return False
    if any(tag.get("isAdult") for tag in m.get("tags", [])):
        return False
    return True

def fetch_page(page: int) -> dict:
    while True:
        try:
            resp = requests.post(
                "https://graphql.anilist.co",
                json={"query": GRAPHQL, "variables": {"page": page, "perPage": PAGE_SIZE}},
                timeout=15,
            )
            if resp.status_code == 429:
                wait = int(resp.headers.get("Retry-After", 300))
                print(f"[Page {page}] Rate limited → sleeping {wait} sec…")
                time.sleep(wait)
                continue
            resp.raise_for_status()
            return resp.json()

        except requests.RequestException as e:
            print(f"[Page {page}] Request error: {e!r}. Retrying in 60 sec…")
            time.sleep(60)

def main():
    with psycopg.connect(db_url) as conn, conn.cursor() as cur:
        page = 1
        while True:
            payload = fetch_page(page)
            media = payload["data"]["Page"]["media"]
            if not media:
                print("No more media—finished!")
                break

            for m in media:
                if not passes_filters(m):
                    continue
                if m["popularity"] >= THRESHOLD:
                    upsert(cur, m, page)

            conn.commit()
            print(f"Page {page} done ({len(media)} titles).")
            page += 1
            time.sleep(0.7)

if __name__ == "__main__":
    main()
