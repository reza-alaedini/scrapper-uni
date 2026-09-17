# Divar Scraper

A full-stack application for searching, collecting, caching, and displaying structured advertisements from [Divar](https://divar.ir/).

> For the complete technical guide, architecture details, API contract, and implementation notes, open the **[full project documentation](./documentation.html)**.

## Summary

Divar Scraper lets users search advertisements by city and category, optionally limit results to a minimum and maximum price, and request the latest listings. The React interface sends the selected filters to a FastAPI backend through the `GET /ads` endpoint.

The backend first checks its local SQLite cache for the requested city and category. If no cached records exist—or if `force=true` is requested—it launches a headless Chromium browser with Playwright, loads the corresponding Divar page, extracts up to 20 advertisements, and stores their title, numeric price, link, and image URL. The API then applies the requested price filters and returns the results as JSON for display in the frontend.

The project is organized into four main layers:

- **Frontend:** React 19, TypeScript, Vite, React Query, and Axios provide the search form, request state, and advertisement cards.
- **API:** FastAPI validates query parameters, enables CORS, exposes interactive Swagger documentation, and coordinates cache and scraping behavior.
- **Scraper:** Playwright runs Divar's JavaScript-powered pages in Chromium and converts advertisement content into structured records.
- **Storage:** SQLite provides a lightweight local cache, avoiding repeated scraping for the same city and category.

The end-to-end data flow is:

`React search form -> GET /ads -> SQLite cache or Playwright scraper -> JSON response -> advertisement cards`

## Main Features

- Search by city and advertisement category
- Filter results by minimum and maximum price
- Reuse cached data for faster responses
- Force-refresh cached listings when newer data is needed
- Display advertisement images, titles, prices, and direct Divar links
- Use FastAPI's interactive API documentation at `/docs`

## Project Structure

```text
divar/
|-- backend/
|   |-- main.py          # FastAPI app, API endpoint, and cache logic
|   |-- scraper.py       # Playwright-based Divar scraper
|   |-- database.py      # SQLite connection setup
|   |-- test.py          # Direct scraper test
|   `-- ads.db           # Local advertisement cache
|-- frontend/
|   `-- divar-scrap/     # React and TypeScript application
|-- documentation.html   # Complete technical documentation
`-- README.md
```

## Quick Start

### 1. Start the backend

```bash
cd backend
pip install fastapi uvicorn playwright
playwright install chromium
python -m uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`, with Swagger UI at `http://127.0.0.1:8000/docs`.

### 2. Configure and start the frontend

Create `frontend/divar-scrap/.env` with:

```env
VITE_BASE_URL=http://127.0.0.1:8000
```

Then run:

```bash
cd frontend/divar-scrap
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.

## API Overview

The frontend uses one main endpoint:

```http
GET /ads?city=tehran&category=mobile-phones&min_price=10000000&max_price=60000000&force=false
```

`city` and `category` are required. `min_price`, `max_price`, and `force` are optional. Each returned advertisement contains `title`, `price`, `link`, and `image_url`.

## Documentation

See **[documentation.html](./documentation.html)** for the detailed Persian-language documentation, including the system architecture, scraper workflow, database schema, API behavior, frontend integration, state handling, and implementation notes.
