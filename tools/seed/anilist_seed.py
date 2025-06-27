"""
Seed Rankhwa DB from AniList.
Usage:
  DB_URL=postgres://user:pass@host/db python tools/seed/anilist_seed.py
"""

import os, requests, time
import psycopg
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
      staff(sort:RELEVANCE, perPage:1){
        nodes { name { full } }
      }
    }
  }
}
"""
THRESHOLD = int(os.getenv("POPULATION_THRESHOLD", 30))
PAGE_SIZE  = 50

def preferred_title(t):
    return (
        t.get("english")        
        or t.get("native")      
        or t.get("romaji")     
        or t.get("userPreferred")
        or "Untitled"
    )

def first_author(m: dict) -> str | None:
    nodes = m.get("staff", {}).get("nodes")
    return nodes[0]["name"]["full"] if nodes else None

def safe_date(y, m, d):
    if not y:        # missing year → store NULL
        return None
    m = m or 1
    d = d or 1
    d = min(d, calendar.monthrange(y, m)[1])  # clamp
    return datetime.date(y, m, d)

def upsert(cur: psycopg.Cursor, m: dict):
    t = m["title"]
    author = first_author(m)
    release_date = safe_date(
        m['startDate']['year'],
        m['startDate']['month'],
        m['startDate']['day'],
    )
    cur.execute("""
        INSERT INTO manhwa
            (anilist_id, title, titles, title_native, title_english,
            author, description, avg_rating, vote_count,
            cover_url, release_date, seed_popularity)
        VALUES (%s,%s,%s::jsonb,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (anilist_id) DO UPDATE
            SET title_native  = COALESCE(manhwa.title_native,  EXCLUDED.title_native),
                title_english = COALESCE(manhwa.title_english, EXCLUDED.title_english)
    """, (
        m["id"],
        preferred_title(t),
        json.dumps(t),
        t["native"],
        t["english"],
        author,
        m["description"],         
        (m["averageScore"] or 0) / 10,
        m["popularity"],
        m["coverImage"]["extraLarge"],
        release_date,              
        m["popularity"],
    ))

def main():
    with psycopg.connect(db_url) as conn, conn.cursor() as cur:
        page = 1
        while True:
            resp = requests.post(
                "https://graphql.anilist.co",
                json={"query": GRAPHQL,
                      "variables": {"page": page, "perPage": PAGE_SIZE}},
                timeout=15,
            )
            resp.raise_for_status()
            media = resp.json()["data"]["Page"]["media"]
            if not media:
                break

            for m in media:
                if m["popularity"] >= THRESHOLD:
                    upsert(cur, m)

            conn.commit()
            print(f"Page {page} done ({len(media)} titles)")
            page += 1
            time.sleep(0.7)     # AniList limit: 90 req/min

if __name__ == "__main__":
    main()