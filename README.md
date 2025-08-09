# Rankhwa

**Discover, organize, and rate manhwa/webtoons.**

Public monorepo containing:
- **rankhwa-frontend** – React + Vite app
- **rankhwa-backend** – Spring Boot API (PostgreSQL, JWT)
- **tools/seed** – Python scripts to seed the database from AniList

> TL;DR: Run Postgres, start the Spring Boot API, start the React app, optionally seed titles from AniList. Secrets are *not* documented here and must be provided via your own environment configuration.

---

## Features
- 🔎 Search & filter (rating, year, genres; sort by rating/date/title)
- 🧾 Title details: description, covers, and alternate titles (English/Romaji/Native)
- ⭐ 1–10 user ratings with cached averages and vote counts
- 📚 User lists (Reading, Completed, Plan to Read, Favorites) + custom lists
- 🔐 JWT-based authentication (email/password, BCrypt hashing)
- 🌐 CORS for local dev & production hosts
- 🧪 DB health/ping endpoint

---

## Tech Stack
**Frontend**: React, Vite, TypeScript, Tailwind, lucide-react  
**Backend**: Java, Spring Boot (Web, Security, Data JPA), JJWT  
**Database**: PostgreSQL 16+ (JSONB for genres & titles)  
**Tools**: Python (requests, psycopg, python-dotenv) for AniList seeding

---

## Repository Layout
```
.
├── rankhwa-frontend/         # React app (Vite)
├── rankhwa-backend/          # Spring Boot API
│   └── src/main/java/com/rankhwa/backend/{config,controller,dto,model,repository,security,service}
└── tools/
    └── seed/
        ├── anilist_seed.py   # AniList → PostgreSQL seeder
        └── requirements.txt  # Python deps for seeding
```

---

## Getting Started (Local Development)

> This repository does **not** include secrets or example `.env` files. Configure your own environment variables and secrets per your setup (local or cloud). Do **not** commit secrets.

### Prerequisites
- Node ≥ 20.19
- Java 17+ (21 recommended)
- PostgreSQL 16+
- Python 3.10+ (for optional seeding)

### 1) Start PostgreSQL (example via Docker)
```bash
docker run --name rankhwa-db -p 5432:5432   -e POSTGRES_DB=rankhwa -e POSTGRES_USER=rankhwa -e POSTGRES_PASSWORD=rankhwa   -d postgres:16
```

### 2) Run the backend
```bash
cd rankhwa-backend
mvn spring-boot:run
# API: http://localhost:8080
```

### 3) Run the frontend
```bash
cd rankhwa-frontend
npm install
npm run dev
# App: http://localhost:5173
```

### 4) (Optional) Seed titles from AniList
Seeding is optional and requires you to configure your own database connection and any thresholds locally or in your runtime environment.
```bash
cd tools/seed
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt || pip install psycopg requests python-dotenv
python anilist_seed.py
```

---

## API Overview (non-exhaustive)

Base: `http://localhost:8080` (or your deployed API base)

### Health
- `GET /health/sanity-check` → `{ "status": "UP" }`

### Auth
- `POST /auth/register` → body: `{ email, password, displayName }`
- `POST /auth/login` → body: `{ email, password }` → `{ token }`

### Users
- `GET /users/{id}` → public profile
- `GET /users/me` → current user (requires `Authorization: Bearer <JWT>`)
- `PATCH /users/me` → update `displayName`

### Manhwa
- `GET /manhwa` – query & filter (params: `query`, `min_rating`, `min_votes`, `year`, `genres` csv, `sort` in `rating|date|title`, `page`, `size`)
- `GET /manhwa/{id}` – detail
- `GET /manhwa/{id}/rating` – current user’s rating (auth)
- `POST /manhwa/{id}/rating` – body: `{ "score": 1..10 }` (auth)

### Lists (auth)
- `GET /lists` – all lists for user
- `POST /lists` – body: `{ "name": "Custom" }`
- `GET /lists/{listId}` – detail (IDs only)
- `PATCH /lists/{listId}` – rename (default lists cannot be renamed)
- `DELETE /lists/{listId}` – delete (default lists cannot be deleted)
- `POST /lists/{listId}/items` – body: `{ "manhwaId": 123 }`
- `DELETE /lists/{listId}/items/{manhwaId}`

**Security** (summary): unauthenticated access for `/auth/**`, `/health/**`, `/users/*`, `/manhwa/**`; authenticated access for `/users/me/**`, `/manhwa/*/rating`, `/lists/**`. JWT is processed via a stateless filter.

---

## Example cURL (placeholders; no secrets)

```bash
# Register (local dev)
curl -X POST http://localhost:8080/auth/register   -H 'Content-Type: application/json'   -d '{"email":"you@example.com","password":"<your-password>","displayName":"You"}'

# Login (local dev)
curl -X POST http://localhost:8080/auth/login   -H 'Content-Type: application/json'   -d '{"email":"you@example.com","password":"<your-password>"}'
# → {"token":"<JWT>"}

# Authenticated request
curl http://localhost:8080/users/me   -H "Authorization: Bearer <JWT>"

# Search
curl "http://localhost:8080/manhwa?query=solo&min_rating=6&genres=Action,Fantasy&sort=rating&page=0&size=20"
```

---

## Deployment Notes (high level)
- Provide all configuration through your own environment setup (CI/CD, container runtime, or platform variables). **Do not** bake secrets into the repo or images.
- Ensure backend CORS allows your production frontend origins.
- Prefer managed Postgres for production deployments and use SSL where appropriate.
- Use proper schema migrations (e.g., Flyway/Liquibase) for production instead of auto-DDL.

---

## Contributing
PRs welcome. Keep commits focused. For entity or schema changes, include appropriate migration scripts for production environments.

---

## License
MIT.

---

## Acknowledgements
- Data seeding powered by the AniList GraphQL API.
- Icons via lucide-react.
